import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { usePrivacyPolicy } from '@/lib/api/hooks/usePrivacyPolicy'
import RenderHtml from 'react-native-render-html';

const PrivacyPolicy = () => {
  const { width } = useWindowDimensions();
  const {isLoading, privacyPolicy} = usePrivacyPolicy();
  if(!privacyPolicy) return null;
  if(isLoading) return <Text>Loading...</Text>;
  console.log("PP : ", JSON.stringify(privacyPolicy));
  return (
    <View>
      <RenderHtml
      contentWidth={width}
      source={{html: privacyPolicy.content.root.type}}
    />
    </View>
  )
}

export default PrivacyPolicy

const styles = StyleSheet.create({})