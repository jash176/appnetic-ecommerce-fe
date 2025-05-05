import { Pressable, Text } from 'react-native';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';
import { StyleSheet } from 'react-native';

type Props = {
  href: string;
  children: React.ReactNode;
  style?: ComponentProps<typeof Text>['style'];
};

export function ExternalLink({ href, children, style }: Props) {
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      // Open the link in an in-app browser on mobile
      await openBrowserAsync(href);
    } else {
      // On web, open in a new tab
      window.open(href, '_blank');
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <Text style={[styles.link, style]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    color: '#0000EE',
    textDecorationLine: 'underline',
  },
});
