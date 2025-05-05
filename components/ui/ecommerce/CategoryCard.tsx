import { Dimensions, Image, Pressable, StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText';
import { Category, Media } from '@/lib/api/services/types';
import { getFullImageUrl } from '@/utils/functions';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.container}
    >
      <View style={[styles.imageContainer, {width}]}>
        <Image
          source={{uri: getFullImageUrl(image.filename as string)}}
          style={[styles.categoryImage, {width}]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
      </View>
      
      <View style={styles.infoContainer}>
        <ThemedText type='title' style={styles.categoryName}>{category.name}</ThemedText>
        <View style={styles.exploreContainer}>
          <ThemedText style={styles.exploreText} type='subtitle'>EXPLORE</ThemedText>
          <Ionicons name="arrow-forward" size={16} color="#4a6eb5" style={styles.icon} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default CategoryCard

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  categoryImage: {
    height: 'auto',
    aspectRatio: 2/3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  infoContainer: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  categoryName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  exploreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  exploreText: {
    color: '#4a6eb5',
    fontSize: 12,
    fontWeight: '600',
  },
  icon: {
    marginLeft: 4,
  }
});