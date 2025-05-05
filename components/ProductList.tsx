import React from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useProducts } from '@/lib/api/hooks/useProducts';
import ProductCard from '@/components/ui/ecommerce/ProductCard';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { Product } from '@/lib/api/services/types';

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
  const { data, isLoading, isError } = useProducts();
  
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }
  
  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={{ color: '#000000' }}>Failed to load products</ThemedText>
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
  
  const handleProductPress = (productId: number) => {
    router.push(`/${productId.toString()}`);
  };
  
  return (
    <View style={styles.container}>
      {title && (
        <ThemedText type="title" style={[styles.title, { color: '#000000' }]}>
          {title}
        </ThemedText>
      )}
      
      <FlatList
        data={data.docs}
        renderItem={({ item }) => (
          <View style={styles.productCardContainer}>
            <ProductCard
              item={item}
              width={180}
              onPress={() => handleProductPress(item.id)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
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
    borderRadius: 8,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  productCardContainer: {
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  loaderContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  errorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
}); 