import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { usePrivacyPolicy } from '@/lib/api/hooks/usePrivacyPolicy'
import RenderHtml from 'react-native-render-html';
import GenericScrollView from '@/components/ui/GenericScrollView';
import Header from '@/components/ui/Header';
import CommonHeader from '@/components/ui/CommonHeader';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PrivacyPolicy = () => {
  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isLoading, privacyPolicy } = usePrivacyPolicy();
  if (isLoading) return <View style={styles.loadingContainer}>
    <ActivityIndicator size='large' color='#000' />
  </View>
  if (!privacyPolicy) return null;
  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <CommonHeader title='Privacy Policy' showBack onBackPress={() => router.back()} />
      <GenericScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
        <RenderHtml
          contentWidth={width}
          source={{ html: privacyPolicy.contentHTML }}
        />
      </GenericScrollView>
    </View>
  )
}

export default PrivacyPolicy

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  }
})