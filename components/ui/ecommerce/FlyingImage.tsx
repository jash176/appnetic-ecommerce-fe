// components/ui/ecommerce/FlyingImage.tsx
import React, { useEffect } from 'react';
import { Animated, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const FlyingImage = ({ imageUri, from, to, onEnd }: any) => {
  const translateX = new Animated.Value(from.x);
  const translateY = new Animated.Value(from.y);
  const scale = new Animated.Value(1);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: to.x,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: to.y,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.2,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start(() => {
      onEnd?.();
    });
  }, []);

  return (
    <Animated.Image
      source={{ uri: imageUri }}
      style={[
        styles.image,
        {
          transform: [
            { translateX },
            { translateY },
            { scale }
          ]
        }
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    width: 100,
    height: 100,
    zIndex: 999,
  }
});

export default FlyingImage;
