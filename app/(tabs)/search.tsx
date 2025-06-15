import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import SearchBar from '@/components/ui/SearchBar';
import { ThemedText } from '@/components/ThemedText';
import ProductCard from '@/components/ui/ecommerce/ProductCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '@/components/ui/Footer';
import { router } from 'expo-router';
import { useCategories, useProducts } from '@/lib/api/hooks/useProducts';
import { Product } from "../../lib/api/services/types"
import CategoryCard from '@/components/ui/ecommerce/CategoryCard';

const PAGE_SIZE = 10;

export default function SearchScreenPage() {
  const { top: paddingTop } = useSafeAreaInsets();
  const handleSearch = (query: string) => {
    if(query.trim().length === 0) return;
    router.push({
      pathname: "/products",
      params: {query: query}
    })
  }

  const productParams = useMemo(() => ({
    page: 1,
    limit: PAGE_SIZE,
  }), []);

  const { data, isError, refetch } = useProducts(productParams);
  const { data: categories, totalDocs } = useCategories();

  // Handle retry on error
  const handleRetry = () => {
    refetch();
  };

  const renderItem: ListRenderItem<Product> = useCallback(({ item, index }) => {
    return (
      <View >
        <ProductCard item={item} onPress={() => router.push(`/${item.id}`)} />
      </View>
    )
  }, [])
  return (
    <View style={styles.container}>
      <FlatList
        data={data ? data.docs : []}
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
          {categories.length > 0 && <ThemedText style={styles.searchHeading} type='heading'>Categories</ThemedText>}
          {totalDocs > 5 && <ThemedText type='title' style={styles.viewAllText} onPress={() => { }}>View all</ThemedText>}
          <FlatList
            data={categories}
            keyExtractor={(item, index) => `${index}-${item.id}`}
            horizontal
            renderItem={({ item }) => (
              <CategoryCard
                width={Dimensions.get("window").width / 2.2}
                item={{ category: item }}
                onPress={() => router.push({
                  pathname: '/category/[id]',
                  params: { id: item.id.toString(), name: item.name },
                })}
              />
            )}
            showsHorizontalScrollIndicator={false}
          />
          <ThemedText style={styles.searchHeading} type='heading'>Products</ThemedText>
        </View>}
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
  },
  viewAllText: {
    textAlign: "right",
    padding: 8
  }
})