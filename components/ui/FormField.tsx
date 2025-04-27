import { StyleSheet, TextInput, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { memo } from "react";

const FormField = memo(({
  label,
  value,
  onChange,
  placeholder = '',
  keyboardType = 'default',
  autoCapitalize = 'none',
  secureTextEntry = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
}) => (
  <View style={styles.formField}>
    <ThemedText style={styles.label}>{label}</ThemedText>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      secureTextEntry={secureTextEntry}
    />
  </View>
));

export default FormField;

const styles = StyleSheet.create({
  formField: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
})
