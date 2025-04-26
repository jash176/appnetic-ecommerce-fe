import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoadingOverlay from './LoadingOverlay';

// Higher-order component that adds loading functionality to any component
export default function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithLoading(
    props: P & { 
      isLoading?: boolean;
      loadingText?: string; 
    }
  ) {
    const { isLoading = false, loadingText, ...restProps } = props;

    return (
      <View style={styles.container}>
        <WrappedComponent {...(restProps as P)} />
        <LoadingOverlay visible={isLoading} text={loadingText} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 