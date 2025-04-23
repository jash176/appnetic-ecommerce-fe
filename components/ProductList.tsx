import React from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useProducts } from '@/lib/api/hooks/useProducts';
import ProductCard from '@/components/ui/ecommerce/ProductCard';
import { ThemedText } from '@/components/ThemedText';

interface ProductListProps {
  categoryId?: string;
  limit?: number;
  featured?: boolean;
  title?: string;
}

export default function ProductList({ 
  categoryId, 
  limit = 10, 
  featured = false,
  title
}: ProductListProps) {
  // Define query parameters based on props
  const queryParams = {
    limit,
    where: {
      ...(categoryId && { categories: { contains: categoryId } }),
      ...(featured && { featured: { equals: true } }),
      status: { equals: 'published' }
    }
  };
  
  // Fetch products using React Query
  const { data, isLoading, isError } = useProducts(queryParams);
  
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  
  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText>Failed to load products</ThemedText>
      </View>
    );
  }
  
  if (!data || data.docs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText>No products found</ThemedText>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {title && (
        <ThemedText type="title" style={styles.title}>{title}</ThemedText>
      )}
      
      <FlatList
        data={data.docs}
        renderItem={({ item }) => (
          <ProductCard
            product={{
              id: item.id,
              title: item.title,
              price: item.price,
              image: item.images[0]?.url || 'https://via.placeholder.com/300',
            }}
            width={180}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 8,
    gap: 12,
  },
  loaderContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 