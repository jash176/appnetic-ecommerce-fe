import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';

const Favourites = () => {
  const { favorites, isLoading, removeFavorite, loadFavorites } = useFavoritesStore();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadFavorites();
  }, []);

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Ionicons name="heart-outline" size={80} color="#ccc" />
          <ThemedText style={styles.emptyStateTitle}>Sign in to see your favorites</ThemedText>
          <ThemedText style={styles.emptyStateSubtitle}>
            Your favorite items will be saved here
          </ThemedText>
          <Button
            title="Sign In"
            onPress={() => router.push('/login')}
            style={styles.actionButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleRemoveFavorite = (productId: number) => {
    Alert.alert(
      "Remove from Favorites",
      "Are you sure you want to remove this item from your favorites?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Remove", 
          onPress: () => removeFavorite(productId),
          style: "destructive"
        }
      ]
    );
  };

  const handleAddToCart = (item: any) => {
    addItem({
      productId: item.productId,
      productTitle: item.productTitle,
      price: item.price,
      image: item.image,
    });
    Alert.alert("Added to Cart", `${item.productTitle} has been added to your cart`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Ionicons name="heart-outline" size={80} color="#ccc" />
          <ThemedText style={styles.emptyStateTitle}>No favorites yet</ThemedText>
          <ThemedText style={styles.emptyStateSubtitle}>
            Items you favorite will be saved here
          </ThemedText>
          <Button
            title="Explore Products"
            onPress={() => router.push('/(tabs)')}
            style={styles.actionButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Favorites</ThemedText>
        <ThemedText style={styles.count}>{favorites.length} items</ThemedText>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.productId.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <TouchableOpacity 
              onPress={() => router.push(`/${item.productId}`)}
              style={styles.productInfo}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.productImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="image-outline" size={30} color="#ccc" />
                </View>
              )}
              <View style={styles.productDetails}>
                <ThemedText style={styles.productTitle} numberOfLines={2}>
                  {item.productTitle}
                </ThemedText>
                <ThemedText style={styles.productPrice}>
                  ${item.price.toFixed(2)}
                </ThemedText>
              </View>
            </TouchableOpacity>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleAddToCart(item)}
              >
                <Ionicons name="cart-outline" size={22} color="#000" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.iconButton, styles.removeButton]}
                onPress={() => handleRemoveFavorite(item.productId)}
              >
                <Ionicons name="trash-outline" size={22} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Favourites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 20,
  },
  productCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  productInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  iconButton: {
    padding: 8,
  },
  removeButton: {
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    minWidth: 200,
  },
});