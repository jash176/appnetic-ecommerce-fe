import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View, TouchableOpacity } from 'react-native';
import SearchBar from '@/components/ui/SearchBar';
import { ThemedText } from '@/components/ThemedText';
import ProductCard from '@/components/ui/ecommerce/ProductCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '@/components/ui/Footer';
import { router } from 'expo-router';
import { useProducts } from '@/lib/api/hooks/useProducts';
import { Product } from "../../lib/api/services/types"
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { Ionicons } from '@expo/vector-icons';

const PAGE_SIZE = 10;

type ProductWhereInput = {
  or: ({
      title: {
          contains: string;
      };
      description?: undefined;
  } | {
      description: {
          contains: string;
      };
      title?: undefined;
  })[];
}

export default function SearchScreenPage() {
  const { top: paddingTop } = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState<ProductWhereInput | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("Explore");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query: string) => {
    const params = query.length > 0 ? {
      or: [
        { title: { contains: query } }
      ]
    } : undefined;
    
    setSearchFilter(params);
    setSearchQuery(query.length > 0 ? query : "Explore");
    setHasSearched(true);
  }

  const productParams = useMemo(() => ({
    page,
    limit: PAGE_SIZE,
    where: searchFilter,
  }), [page, searchFilter]);

  // Use our products hook
  const { data, isError, refetch } = useProducts(productParams);

  // Handle retry on error
  const handleRetry = () => {
    refetch();
  };

  const renderItem: ListRenderItem<Product> = useCallback(({ item, index }) => {
    return (
      <ProductCard item={item} onPress={() => router.push(`/${item.id}`)} />
    )
  }, [])

  // Empty results component
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

  // Determine the loading message based on the search state
  const getLoadingMessage = () => {
    if (!hasSearched) return "Loading products...";
    if (searchQuery !== "Explore") return `Searching for "${searchQuery}"...`;
    return "Fetching products...";
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        style={{ backgroundColor: "#FFF" }}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 50 }} />}
        contentContainerStyle={[
          styles.listContent, 
          { paddingTop }
        ]}
        numColumns={2}
        ListHeaderComponent={<View>
          <SearchBar
            placeholder="Search products"
            onSearch={handleSearch}
            initialValue={""}
          />
          <ThemedText style={styles.searchHeading} type='heading'>{searchQuery}</ThemedText>
        </View>}
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
  );
}

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
    paddingHorizontal: 16,
    marginBottom: 16,
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
  }
})