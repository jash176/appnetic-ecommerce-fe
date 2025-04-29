import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ThemedText } from '@/components/ThemedText'
import { Ionicons } from '@expo/vector-icons';
import ProductImageCarousel from './ProductImageCarousel';
import { router } from 'expo-router';
import { Product } from '@/lib/api/services/types';

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

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to product details
      router.push(`/${item.id}`);
    }
  };

  // Check if there's a compare price available
  const hasComparePrice = item.compareAtPrice && item.compareAtPrice > item.price;

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
          <View style={styles.priceContainer}>
            {hasComparePrice && (
              <ThemedText numberOfLines={1} style={styles.comparePrice}>
                Rs. {item.compareAtPrice?.toFixed(2)}
              </ThemedText>
            )}
            <ThemedText 
              numberOfLines={1} 
              type='title' 
              style={hasComparePrice ? styles.salePrice : undefined}
            >
              Rs. {item.price.toFixed(2)}
            </ThemedText>
          </View>
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
  priceContainer: {
    flexDirection: 'row-reverse',
    alignItems: "center"
  },
  comparePrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 12,
  },
  salePrice: {
    color: '#EE3434',
    marginRight: 6
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