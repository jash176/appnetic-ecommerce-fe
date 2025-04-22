import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  GestureResponderEvent 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AccordionItemProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  rightIcon?: string;
  leftIcon?: string;
}

const AccordionItem = ({ 
  label, 
  onPress, 
  rightIcon = "chevron-forward", 
  leftIcon 
}: AccordionItemProps) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.itemContent}>
        {leftIcon && (
          <Ionicons name={leftIcon as any} size={20} color="#555" style={styles.leftIcon} />
        )}
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      {rightIcon && <Ionicons name={rightIcon as any} size={18} color="#999" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 14,
    color: '#333',
  },
  leftIcon: {
    marginRight: 8,
  },
});

export default AccordionItem;