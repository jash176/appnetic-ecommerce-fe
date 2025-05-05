import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Animation for the chevron rotation
  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withTiming(isOpen ? '90deg' : '0deg', { duration: 200 }) }],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.7}>
        <Animated.View style={rotateStyle}>
          <IconSymbol
            name="chevron.right"
            size={18}
            weight="medium"
            color="#000000"
          />
        </Animated.View>

        <ThemedText type="title" style={{ color: '#000000' }}>{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && (
        <ThemedView style={styles.content}>{children}</ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
    paddingBottom: 16,
    paddingRight: 16,
  },
});
