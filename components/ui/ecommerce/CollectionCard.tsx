import { ActivityIndicator, Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText';
import { useFeaturedCollection } from '@/lib/api/hooks/useCollections';

interface CollectionCardProps {
  title: string;
  width?: number;
  onPress?: () => void;
}

const CollectionCard = (props: CollectionCardProps) => {
  const storeId = 1;
  const featuredSlug = "featured-collection"
  const { data: collection, isLoading: collectionLoading, isError: collectionError } = useFeaturedCollection(storeId, featuredSlug);
  const { width = Dimensions.get("window").width, onPress, title } = props;
  if(!collection) return null;
  if(collectionLoading) return <ActivityIndicator />;
  console.log("Collection : ", collection)
  return (
    <Pressable onPress={onPress}>
      <Image
        source={{uri: `http://10.2.0.0:3000/${collection.image.url}`}}
        style={[styles.collectionImage, {width}]}
      />
      <View style={styles.infoContainer}>
        <ThemedText type='heading' style={styles.title}>{collection.title}</ThemedText>
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