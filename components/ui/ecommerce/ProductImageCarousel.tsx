import { Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';

const images = [
  "https://image.hm.com/assets/hm/37/0f/370fc4c5154048a26541cf6801a5c71ba14fa47c.jpg?imwidth=820",
  "https://image.hm.com/assets/hm/09/58/09589525fdfe2c7b755c0db044bca14d73267cc6.jpg?imwidth=820",
  "https://image.hm.com/assets/hm/be/88/be8824b115e8e73bd91eb32926b7dcbc1eb377f3.jpg?imwidth=820"
]

interface IProductImageCarousel {
  showDots?: boolean;
  width?: number
}

const ProductImageCarousel = (props: IProductImageCarousel) => {
  const {width = Dimensions.get("window").width / 2, showDots = false} = props;
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };
  return (
    <View style={[{width}]}>
      <FlatList
        data={images}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) =>{ 
          return(
            <Image source={{uri: item}} style={[styles.image, {width}]} />
          )
        }}
        onMomentumScrollEnd={showDots ? onScrollEnd : undefined}
        horizontal
        pagingEnabled
      />
      {showDots && <View style={styles.dotContainer}>
        {images.map((_, i) => {
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