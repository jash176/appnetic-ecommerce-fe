import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, FlatList, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useFeaturedCollection } from '@/lib/api/hooks/useCollections';
import { useProducts } from '@/lib/api/hooks/useProducts';
import { ThemedText } from './ThemedText';

export interface FeaturedCollectionProps {
  storeId?: number;
  featuredSlug?: string;
  limit?: number;
}

export default function FeaturedCollection({ 
  storeId = 1, 
  featuredSlug = 'featured-collection',
  limit = 10
}: FeaturedCollectionProps) {
  // Fetch the featured collection
  const { data: collection, isLoading: collectionLoading, isError: collectionError } = useFeaturedCollection(storeId, featuredSlug);

  // Fetch products from the collection when available
  const { data: productData, isLoading: productsLoading, isError: productsError } = useProducts(
    collection?.products && collection.products.length > 0 
      ? {
          limit,
          where: {
            id: {
              in: collection.products.map(p => typeof p === 'number' ? p : p.id)
            }
          }
        }
      : undefined
  );

  const isLoading = collectionLoading || productsLoading;
  const isError = collectionError || productsError;

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
        <ThemedText>Failed to load featured collection</ThemedText>
      </View>
    );
  }

  if (!collection) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText>No featured collection found</ThemedText>
      </View>
    );
  }

  if (!productData || productData.docs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText>No products found in this collection</ThemedText>
      </View>
    );
  }

  const handleProductPress = (productId: number) => {
    router.push({
      pathname: "/product-details",
      params: { id: productId.toString() }
    });
  };

  return (
    <View style={styles.container}>
      {collection.title && (
        <ThemedText type="title" style={styles.title}>{collection.title}</ThemedText>
      )}
      
      {collection.description && (
        <View style={styles.descriptionContainer}>
          <ThemedText style={styles.description}>{collection.description.toString()}</ThemedText>
        </View>
      )}
      
      <FlatList
        data={productData.docs}
        renderItem={({ item }) => (
          <Pressable
            style={styles.productCard}
            onPress={() => handleProductPress(item.id)}
          >
            {item.images && item.images.length > 0 && (
              <Image 
                source={{ uri: typeof item.images[0].image === 'number' 
                  ? `https://your-payload-cms-url.com/api/media/${item.images[0].image}`
                  : item.images[0].image.url || 'https://via.placeholder.com/300'
                }} 
                style={styles.productImage} 
                resizeMode="cover"
              />
            )}
            <View style={styles.productInfo}>
              <ThemedText style={styles.productTitle}>{item.title}</ThemedText>
              <ThemedText style={styles.productPrice}>${item.price.toFixed(2)}</ThemedText>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
      
      <Pressable 
        style={styles.viewAllButton}
        onPress={() => {
          // Navigate back to the home tab with collection filter
          if (collection) {
            router.push({
              pathname: "/(tabs)",
              params: { collectionId: collection.id.toString() }
            });
          }
        }}
      >
        <ThemedText style={styles.viewAllText}>View All</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 20,
  },
  loaderContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingVertical: 10,
  },
  productCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f7f7f7',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  viewAllButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  viewAllText: {
    fontWeight: '500',
  },
}); 