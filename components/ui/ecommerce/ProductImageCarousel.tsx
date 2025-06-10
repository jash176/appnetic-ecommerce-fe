import { Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import { Media } from '@/lib/api/services/types';
import { getFullImageUrl } from '@/utils/functions';

interface IProductImageCarousel {
  showDots?: boolean;
  width?: number;
  images: { image: number | Media; isPrimary?: boolean | null | undefined; id?: string | null | undefined; }[] | undefined | null
}

const ProductImageCarousel = (props: IProductImageCarousel) => {
  const {width = Dimensions.get("window").width / 2, showDots = false, images} = props;
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };
  
  return (
    <View style={[{width}]}>
      {images && <FlatList
        data={images.map(image => {
          const imageObj = image.image as Media
          return getFullImageUrl(imageObj.filename ?? "")
        })}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) =>{ 
          return(
            <Image source={{uri: item}} style={[styles.image, {width}]} />
          )
        }}
        onMomentumScrollEnd={showDots ? onScrollEnd : undefined}
        horizontal
        pagingEnabled
      />}
      {showDots && <View style={styles.dotContainer}>
        {images && images.map((_, i) => {
          return(
            <View key={`dot_${i}`} style={currentIndex === i ? styles.activeDot : styles.inactiveDot} />
          )
        })}
      </View>}
    </View>
  )
}

export default ProductImageCarousel

const styles = StyleSheet.create({
  image: {
    height: 'auto',
    aspectRatio: 2/3
  },
  dotContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    position: 'absolute',
    bottom: 20,
    left: 16
  },
  activeDot: {
    height: 8,
    width: 8,
    borderWidth: 1,
    backgroundColor: "#000"
  },
  inactiveDot: {
    height: 8,
    width: 8,
    borderWidth: 1,
    backgroundColor: "#FFF"
  }
})