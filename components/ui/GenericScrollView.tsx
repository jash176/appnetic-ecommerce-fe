import { ScrollView, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, StyleProp, ViewStyle } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GenericScrollViewProps {
  children: React.ReactNode;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const GenericScrollView = (props: GenericScrollViewProps) => {
  const { children, onScroll, scrollEventThrottle, contentContainerStyle } = props;
  const { top: paddingTop } = useSafeAreaInsets()
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[{ paddingTop, paddingBottom: 90 }, contentContainerStyle]}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
    >
      {children}
    </ScrollView>
  )
}

export default GenericScrollView

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF"
  }
})