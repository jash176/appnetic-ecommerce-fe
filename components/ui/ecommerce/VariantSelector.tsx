import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface VariantOption {
  title: string;
  price: number;
  compareAtPrice?: number | null;
  sku?: string | null;
  inventory?: {
    trackInventory?: boolean | null;
    quantity?: number | null;
  };
  options?: {
    name: string;
    value: string;
    id?: string | null;
  }[] | null;
  id?: string | null;
}

interface VariantSelectorProps {
  options: VariantOption[] | null | undefined;
  selectedValue?: string;
  onSelect: (value: string) => void;
  variantTitle?: string;
}
const screenWidth = Dimensions.get('window').width - 32;
const BOX_PER_ROW = 5;
const BOX_WIDTH = screenWidth / BOX_PER_ROW;
const VariantSelector = ({
  options,
  selectedValue,
  onSelect,
  variantTitle,
}: VariantSelectorProps) => {
  if (!options || options.length <= 0) return null;

  const isVariantAvailable = (variant: VariantOption) => {
    return !variant.inventory?.trackInventory || 
      (variant.inventory?.trackInventory && variant.inventory?.quantity && variant.inventory?.quantity > 0);
  };

  return (
    <View style={styles.container}>
      {variantTitle && (
        <ThemedText type="title" style={styles.variantTitle}>
          {variantTitle}
        </ThemedText>
      )}
      <View style={styles.wrapper}>
        {options.map((size, index) => {
          const row = Math.floor(index / BOX_PER_ROW);
          const col = index % BOX_PER_ROW;
          const isFirstCol = col === 0;
          const isFirsRow = row === 0;
          const isAvailable = isVariantAvailable(size);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.box,
                isFirstCol && { borderLeftWidth: 1 },
                isFirsRow && { borderTopWidth: 1 },
                selectedValue === size.id && styles.selectedBox,
              ]}
              onPress={() => {
                if (size.id && isAvailable) {
                  onSelect(size.id);
                }
              }}
              disabled={!isAvailable}
              activeOpacity={isAvailable ? 0.7 : 1}
            >
              <ThemedText style={!isAvailable && styles.unavailableTitle}>{size.title}</ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  variantTitle: {
    marginBottom: 8,
  },

  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: screenWidth,
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: screenWidth,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  box: {
    width: BOX_WIDTH,
    height: 60,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderRightWidth: 1
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  selectedBox: {
    backgroundColor: '#f0f0f0',
  },
  selectedText: {
    fontWeight: 'bold',
    color: 'black',
  },
  unavailableTitle: {
    textDecorationLine: 'line-through',
  }
});

export default VariantSelector;