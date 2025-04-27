import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';

interface ProductActionsProps {
  product: {
    productId: number;
    productTitle: string;
    price: number;
    image?: string | null;
  };
  compact?: boolean;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product, compact = false }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  const isProductFavorite = isFavorite(product.productId);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to save items to your favorites",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Sign In",
            onPress: () => router.push('/login')
          }
        ]
      );
      return;
    }

    if (isProductFavorite) {
      removeFavorite(product.productId);
      Alert.alert("Removed from Favorites", `${product.productTitle} has been removed from your favorites`);
    } else {
      addFavorite(product);
      Alert.alert("Added to Favorites", `${product.productTitle} has been added to your favorites`);
    }
  };

  const handleAddToCart = () => {
    addItem(product);
    Alert.alert("Added to Cart", `${product.productTitle} has been added to your cart`);
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleToggleFavorite}
        >
          <Ionicons
            name={isProductFavorite ? "heart" : "heart-outline"}
            size={22}
            color={isProductFavorite ? "#FF3B30" : "#000"}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleToggleFavorite}
      >
        <Ionicons
          name={isProductFavorite ? "heart" : "heart-outline"}
          size={24}
          color={isProductFavorite ? "#FF3B30" : "#000"}
        />
      </TouchableOpacity>
      
      <Button
        title="Add to Cart"
        onPress={handleAddToCart}
        style={styles.addToCartButton}
        fullWidth
      />
    </View>
  );
};

export default ProductActions;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  compactContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addToCartButton: {
    flex: 1,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
}); 