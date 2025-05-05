import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ThemedText } from '@/components/ThemedText'
import { Ionicons } from '@expo/vector-icons';
import ProductImageCarousel from './ProductImageCarousel';
import { router } from 'expo-router';
import { Product } from '@/lib/api/services/types';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ProductCardProps {
  width?: number;
  onPress?: () => void;
  showDots?: boolean;
  item: Product
}

const ProductCard = (props: ProductCardProps) => {
  const {
    width = Dimensions.get("window").width / 2 - 24, 
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

  // Calculate discount percentage if there's a compare price
  const discountPercentage = hasComparePrice && item.compareAtPrice ? 
    Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100) : 0;

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={[{ width }, styles.cardContainer]}
    >
      <TouchableOpacity 
        style={styles.touchable} 
        activeOpacity={0.9} 
        onPress={handlePress}
      >
        <View style={styles.imageContainer}>
          <ProductImageCarousel images={item.images} width={width} showDots={showDots} />
          
          {hasComparePrice && discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <ThemedText style={styles.discountText}>-{discountPercentage}%</ThemedText>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.heartContainer}
            onPress={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.heartButton}>
              <Ionicons 
                size={18} 
                name={liked ? 'heart' : 'heart-outline'} 
                color={liked ? "#FF0000" : "#555"} 
              />
            </View>
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
                style={hasComparePrice ? styles.salePrice : styles.regularPrice}
              >
                Rs. {item.price.toFixed(2)}
              </ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default ProductCard

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  touchable: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    height: 'auto',
    aspectRatio: 2/3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  infoContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14
  },
  title: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: '#333',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: "center",
    gap: 8,
  },
  comparePrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 12,
  },
  salePrice: {
    color: '#EE3434',
    fontSize: 14,
    fontWeight: '600',
  },
  regularPrice: {
    color: '#4a6eb5',
    fontSize: 14,
    fontWeight: '600',
  },
  heartContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  heartButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EE3434',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  discountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});