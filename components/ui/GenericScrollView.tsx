import { ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
interface GenericScrollViewProps {
  children: React.ReactNode;
}
const GenericScrollView = (props: GenericScrollViewProps) => {
  const { children } = props;
  const { top: paddingTop, bottom: paddingBottom } = useSafeAreaInsets()
  return (
    <ScrollView style={[styles.container, { paddingTop, paddingBottom }]}>
      {children}
    </ScrollView>
  )
}

export default GenericScrollView

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})