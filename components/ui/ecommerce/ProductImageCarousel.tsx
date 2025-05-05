import { Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import { Media } from '@/lib/api/services/types';
import { getFullImageUrl } from '@/utils/functions';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withTiming,
  FadeIn
} from 'react-native-reanimated';

interface IProductImageCarousel {
  showDots?: boolean;
  width?: number;
  images: { image: number | Media; alt: string; isPrimary?: boolean | null | undefined; id?: string | null | undefined; }[] | undefined | null
}

const ProductImageCarousel = (props: IProductImageCarousel) => {
  const {width = Dimensions.get("window").width / 2, showDots = false, images} = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const opacity = useSharedValue(1);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== currentIndex) {
      // Slight fade effect on image transition
      opacity.value = 0.8;
      opacity.value = withTiming(1, { duration: 300 });
      setCurrentIndex(newIndex);
    }
  };

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  
  return (
    <Animated.View 
      style={[{width}, styles.container]}
      entering={FadeIn.duration(300)}
    >
      {images && <FlatList
        data={images.map(image => {
          const imageObj = image.image as Media
          return getFullImageUrl(imageObj.filename ?? "")
        })}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) =>{ 
          return(
            <Animated.Image 
              source={{uri: item}} 
              style={[styles.image, {width}, animatedImageStyle]} 
              resizeMode="cover"
            />
          )
        }}
        onMomentumScrollEnd={onScrollEnd}
        horizontal
        pagingEnabled
        bounces={false}
      />}
      
      {showDots && images && images.length > 1 && (
        <View style={styles.dotContainer}>
          {images.map((_, i) => (
            <View 
              key={`dot_${i}`} 
              style={[
                styles.dot,
                currentIndex === i ? styles.activeDot : styles.inactiveDot
              ]} 
            />
          ))}
        </View>
      )}
    </Animated.View>
  )
}

export default ProductImageCarousel

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    height: 'auto',
    aspectRatio: 2/3,
  },
  dotContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },
  activeDot: {
    backgroundColor: "#4a6eb5",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inactiveDot: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 0.5,
  }
});