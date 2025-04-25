import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText';
import { Category, Media } from '@/lib/api/services/types';
import { getFullImageUrl } from '@/utils/functions';

interface CategoryCardProps {
  item: {
    category: number | Category;
    id?: string | null;
}
  width?: number;
  onPress?: () => void;
}

const CategoryCard = (props: CategoryCardProps) => {
  const {width = Dimensions.get("window").width / 2, onPress, item } = props;
  const category = item.category as Category;
  const image = category.image as Media
  return (
    <Pressable onPress={onPress}>
      <Image
        source={{uri: getFullImageUrl(image.filename as string)}}
        style={[styles.categoryImage, {width}]}
      />
      <View style={styles.infoContainer}>
        <ThemedText type='title'>{category.name}</ThemedText>
        <ThemedText style={styles.exploreText} type='subtitle'>EXPLORE</ThemedText>
      </View>
    </Pressable>
  )
}

export default CategoryCard

const styles = StyleSheet.create({
  categoryImage: {
    height: 'auto',
    aspectRatio: 2/3
  },
  infoContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  exploreText: {
    marginTop: 8
  }
})