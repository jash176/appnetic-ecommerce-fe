import { Text, type TextProps, StyleSheet } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'heading' | 'title' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  // Always use black text color
  const color = '#000000';

  return (
    <Text
      style={[
        { color },
        styles[type],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "DMSans_400Regular",
  },
  heading: {
    fontSize: 36,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 48,
    marginTop: 24,
    marginHorizontal: 16,
    // lineHeight: 46
  },
  title: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    fontFamily: "DMSans_400Regular",
    textDecorationLine: 'underline',
  },
});
