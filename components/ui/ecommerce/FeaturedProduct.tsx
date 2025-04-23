import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText';

interface FeaturedProductProps {
  price: string;
  width?: number;
  onPress?: () => void;
}

const FeaturedProduct = (props: FeaturedProductProps) => {
  const {price, onPress, width} = props
  return (
    <Pressable onPress={onPress}>
      <Image
        source={{uri: "https://image.hm.com/content/dam/global_campaigns/season_01/women/startpage-assets/wk16/DS21G-2x3-women-startpage-wk16.jpg?imwidth=320"}}
        style={[styles.collectionImage, {width}]}
      />
      <View style={styles.priceContainer}>
      <TouchableOpacity>
          <ThemedText type='title' style={styles.btnShopNow}>{price}</ThemedText>
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