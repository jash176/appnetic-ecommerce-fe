import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ThemedText } from '@/components/ThemedText'
import { Ionicons } from '@expo/vector-icons';
import ProductImageCarousel from './ProductImageCarousel';
import { useCartStore } from '@/store/cartStore';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Media, Product } from '@/lib/api/services/types';

interface ProductCardProps {
  width?: number;
  onPress?: () => void;
  showDots?: boolean;
  item: Product
}

const ProductCard = (props: ProductCardProps) => {
  const {
    width = Dimensions.get("window").width / 2, 
    onPress, 
    showDots = false,
    item
  } = props;
  
  const [liked, setLiked] = useState(false);
  const { addItem } = useCartStore();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to product details
      router.push('/product-details');
    }
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    
    // Add to cart with default variant
    // addItem({
    //   id: product.id,
    //   title: product.title,
    //   price: product.price,
    //   image: product.image,
    // });
    
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if(!item) return null;

  return (
    <TouchableOpacity style={{width}} activeOpacity={0.9} onPress={handlePress}>
      <ProductImageCarousel images={item.images} width={width} showDots={showDots} />
      <View style={styles.heartContainer}>
        <TouchableOpacity onPress={(e) => {
          e.stopPropagation();
          setLiked(!liked);
        }}>
          <Ionicons size={20} name={liked ? 'heart' : 'heart-outline'} color={liked ? "#FF0000" : "#000"} />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <ThemedText numberOfLines={1} type='title' style={styles.title}>{item.title}</ThemedText>
        <View style={styles.priceRow}>
          <ThemedText numberOfLines={1} type='title'>Rs. {item.price.toFixed(2)}</ThemedText>
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Ionicons name="bag-add-outline" size={18} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ProductCard

const styles = StyleSheet.create({
  productImage: {
    height: 'auto',
    aspectRatio: 2/3
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16
  },
  title: {
    fontFamily: "DMSans_500Medium"
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  addToCartButton: {
    padding: 8,
  },
  heartContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 48
  }
})