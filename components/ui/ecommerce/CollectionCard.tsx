import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText';
import { Collection, Media } from '@/lib/api/services/types';
import { getFullImageUrl } from '@/utils/functions';

interface CollectionCardProps {
  item: {
    collection: number | Collection;
    title: string;
    description: string;
    id?: string | null;
  }
  width?: number;
  onPress?: () => void;
}

const CollectionCard = (props: CollectionCardProps) => {
  const {item, onPress, width} = props;
  const collection = item.collection as Collection
  const image = collection.image as Media
  return (
    <Pressable onPress={onPress}>
      <Image
        source={{uri: getFullImageUrl(image.filename as string)}}
        style={[styles.collectionImage, {width}]}
      />
      <View style={styles.infoContainer}>
        <ThemedText type='heading' style={styles.title}>{item?.title}</ThemedText>
        <TouchableOpacity>
          <ThemedText type='link' style={styles.btnShopNow}>{"SHOP NOW"}</ThemedText>
        </TouchableOpacity>
      </View>
    </Pressable>
  )
}

export default CollectionCard

const styles = StyleSheet.create({
  collectionImage: {
    height: 'auto',
    aspectRatio: 2/3
  },
  infoContainer: {
    position: "absolute",
    width: "100%",
    bottom: 56,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  title: {
    color: "#FFFFFF",
    marginBottom: 0,
    textAlign: "center",
    letterSpacing: 5,
    fontSize: 48
  },
  btnShopNow: {
    color: "#000000",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4
  }
})