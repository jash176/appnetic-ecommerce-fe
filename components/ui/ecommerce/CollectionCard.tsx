import { Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText';

interface CollectionCardProps {
  title: string;
  width?: number;
  onPress?: () => void;
}

const CollectionCard = (props: CollectionCardProps) => {
  const { width = Dimensions.get("window").width, onPress, title } = props;
  return (
    <Pressable onPress={onPress}>
      <Image
        source={{uri: "https://image.hm.com/content/dam/global_campaigns/season_01/women/startpage-assets/wk16/Tops-2x3-4-CE-Women-wk16.jpg?imwidth=657"}}
        style={[styles.collectionImage, {width}]}
      />
      <View style={styles.infoContainer}>
        <ThemedText type='heading' style={styles.title}>{title}</ThemedText>
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