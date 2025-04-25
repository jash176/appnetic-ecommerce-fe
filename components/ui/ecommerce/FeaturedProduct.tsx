import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText';
import { getFullImageUrl } from '@/utils/functions';
import { Media, Product } from '@/lib/api/services/types';

interface FeaturedProductProps {
  item: {
    product: number | Product;
    id?: string | null;
}
  width?: number;
  onPress?: () => void;
}

const FeaturedProduct = (props: FeaturedProductProps) => {
  const {item, onPress, width} = props;
  const product = item.product as Product;
  const image = product.images ? product.images[0].image as Media : null
  if(!product) return null;
  return (
    <Pressable onPress={onPress}>
      <Image
        source={{uri: getFullImageUrl(image?.filename as string)}}
        style={[styles.collectionImage, {width}]}
      />
      <View style={styles.priceContainer}>
      <TouchableOpacity>
          <ThemedText type='title' style={styles.btnShopNow}>Rs. {product.price.toFixed(2)}</ThemedText>
        </TouchableOpacity>
      </View>
    </Pressable>
  )
}
export default FeaturedProduct

const styles = StyleSheet.create({
  collectionImage: {
    height: 'auto',
    aspectRatio: 2/3
  },
  priceContainer: {
    position: "absolute",
    bottom: 140,
    right: 10
  },
  btnShopNow: {
    color: "#000000",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4
  }
})