import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { ThemedText } from '../ThemedText'
const Footer = () => {
  return (
    <View>
      <View style={{ paddingVertical: 48, paddingHorizontal: 16 }}>
      </View>
      <View style={styles.footerContainer}>
        <Image source={require("../../assets/images/app-logo.png")} style={styles.appLogo} />
        <ThemedText type="subtitle">{"The content of this site is copyright-protected and is the property of"} {process.env.EXPO_PUBLIC_STORE_NAME}</ThemedText>
      </View>
    </View>
  )
}

export default Footer

const styles = StyleSheet.create({
  footerContainer: {
    gap: 40,
    paddingHorizontal: 16
  },
  appLogo: {
    resizeMode: 'contain',
    width: 180
  }
})