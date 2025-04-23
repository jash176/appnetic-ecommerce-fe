import { Dimensions, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { ThemedText } from '@/components/ThemedText'
import { Ionicons } from '@expo/vector-icons';
import ProductImageCarousel from './ProductImageCarousel';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface ProductCardProps {
  // title: string;
  width?: number;
  onPress?: () => void;
}

const ProductCard = (props: ProductCardProps) => {
  const {width = Dimensions.get("window").width / 2, onPress} = props;
  const [liked, setLiked] = useState(false)
  return (
    <TouchableOpacity style={{width}} activeOpacity={1} onPress={onPress}>
      <ProductImageCarousel width={width} />
      <View style={styles.heartContainer}>
        <TouchableOpacity onPress={() => setLiked(!liked)}>
          <Ionicons size={20} name={liked ? 'heart' : 'heart-outline'} color={liked ? "#FF0000" : "#000"} />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <ThemedText numberOfLines={1} type='title' style={styles.title}>Ballerina-neckline top</ThemedText>
        <ThemedText numberOfLines={1} type='title'>Rs. 699.00</ThemedText>
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
    paddingTop: 8
  },
  title: {
    fontFamily: "DMSans_500Medium"
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