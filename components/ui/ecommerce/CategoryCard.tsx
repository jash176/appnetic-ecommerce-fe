import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText';

interface CategoryCardProps {
  title: string;
  width?: number;
  onPress?: () => void;
}

const CategoryCard = (props: CategoryCardProps) => {
  const {width = Dimensions.get("window").width / 2, onPress, title } = props;
  return (
    <Pressable onPress={onPress}>
      <Image
        source={{uri: "https://image.hm.com/content/dam/global_campaigns/season_01/women/startpage-assets/wk16/Tops-2x3-4-CE-Women-wk16.jpg?imwidth=657"}}
        style={[styles.categoryImage, {width}]}
      />
      <View style={styles.infoContainer}>
        <ThemedText type='title'>{title}</ThemedText>
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