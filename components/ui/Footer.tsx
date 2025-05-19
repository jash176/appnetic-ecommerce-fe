import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Accordion from './Accordion'
import { ThemedText } from '../ThemedText'
const Footer = () => {
  return (
    <View>
      <View style={{ paddingVertical: 48, paddingHorizontal: 16 }}>
        <Accordion title='SHOP'>
          <Accordion.Item>
            <ThemedText>T-SHIRTS</ThemedText>
          </Accordion.Item>
          <Accordion.Item>
            <ThemedText>T-SHIRTS</ThemedText>
          </Accordion.Item>
          <Accordion.Item>
            <ThemedText>T-SHIRTS</ThemedText>
          </Accordion.Item>
          <Accordion.Item>
            <ThemedText>T-SHIRTS</ThemedText>
          </Accordion.Item>
          <Accordion.Item>
            <ThemedText>T-SHIRTS</ThemedText>
          </Accordion.Item>
        </Accordion>
        <Accordion title='HELP'>
          <ThemedText>T-SHIRTS</ThemedText>
        </Accordion>
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
    height: 60,
    width: 60
  }
})