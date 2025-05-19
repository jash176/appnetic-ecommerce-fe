import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { getStoreId } from '@/service/storeService';
import { useProducts } from '@/lib/api/hooks/useProducts';
import ProductCard from '@/components/ui/ecommerce/ProductCard';
import { Product } from '@/lib/api/services/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchBar from '@/components/ui/SearchBar';
import Footer from '@/components/ui/Footer';
import SortAndFilter from '@/components/SortAndFilter';
import { useImmer } from 'use-immer';
const PAGE_SIZE = 10;

type ProductFilterQuery = {
  store: {
      equals: number;
  };
  or: {
      title: {
          contains: string | string[];
      };
  }[];
  sort?: string;
  price?: {
    greater_than_equal: number,
    less_than_equal: number,
  },
}

const Products = () => {
  const { query } = useLocalSearchParams();
  const { top: paddingTop } = useSafeAreaInsets();
  const store = getStoreId()
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [hasSearched, setHasSearched] = useState<boolean>(query.length > 0);
  const [range, setRange] = useState([0, 5000]);
  const [searchFilter, updateSearchFilter] = useImmer<ProductFilterQuery>({
    store: {equals: store},
    or: [
      {title: {contains: query as string || ""}}
    ],
    sort: "createdAt"
  })
  const productParams = useMemo(() => ({
    page,
    limit: PAGE_SIZE,
    where: searchFilter,
  }), [page, searchFilter]);
  const { data, isError, refetch } = useProducts(productParams);
  // Handle retry on error
  const handleRetry = () => {
    refetch();
  };
  const handleSearch = (query: string) => {
    updateSearchFilter(prev => {
      prev.or[0].title.contains = query
    })
    setSearchQuery(query);
    setHasSearched(true);
  }
  const handleSort = (sort: string) => {
    updateSearchFilter(prev => {
      prev.sort = sort
    })
    setHasSearched(true);
  }
  const handleFilter = (range: number[]) => {
    setRange(range)
    updateSearchFilter(prev => {
      prev.price = {greater_than_equal: range[0], less_than_equal: range[1]}
    })
  }
  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        {hasSearched && searchQuery !== "Explore" ? (
          <>
            <Ionicons name="search-outline" size={50} color="#ccc" />
            <ThemedText style={styles.emptyTitle}>No results found</ThemedText>
            <ThemedText style={styles.emptyText}>
              We couldn't find any products matching "{searchQuery}"
            </ThemedText>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => handleSearch("")}
            >
              <ThemedText>View All Products</ThemedText>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Ionicons name="pricetag-outline" size={50} color="#ccc" />
            <ThemedText style={styles.emptyTitle}>Discover Products</ThemedText>
            <ThemedText style={styles.emptyText}>
              Search for products or browse our catalog
            </ThemedText>
          </>
        )}
      </View>
    );
  };
  const renderItem: ListRenderItem<Product> = useCallback(({ item }) => {
    return (
      <View >
        <ProductCard item={item} onPress={() => router.push(`/${item.id}`)} />
      </View>
    )
  }, [])
  const onEndReached = useCallback(() => {
    if(data && data.hasNextPage) {
      setPage(prev => prev + 1)
    }
  }, [data])
  if(!data) return null;
  return (
    <View style={styles.container}>
      <FlatList
        data={data.docs}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}-${item.id}`}
        ItemSeparatorComponent={() => <View style={{ height: 50 }} />}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop }
        ]}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        ListHeaderComponent={() => (
          <View>
            <SearchBar
              placeholder="Search products"
              onSearch={handleSearch}
              initialValue={query as string}
            />
            <ThemedText style={styles.searchHeading} type='heading'>{searchQuery || "Explore"}</ThemedText>
            <SortAndFilter
              onSortChange={handleSort}
              selectedSort={searchFilter.sort as string}
              onFilterChange={handleFilter}
              filterRange={[0, 5000]}
              initialRange={range}
            />
          </View>
        )}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={<Footer />}
      />
       {/* Error state */}
       {isError && (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Failed to load products</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <ThemedText>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default Products

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    position: 'relative',
  },
  listContent: {
    paddingBottom: 90,
    minHeight: '100%', // Ensure empty state fills the screen
  },
  searchHeading: {
    textTransform: "uppercase",
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
})