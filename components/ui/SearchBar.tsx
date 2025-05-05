import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import Animated, { FadeIn } from 'react-native-reanimated';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  initialValue?: string;
}

const SearchBar = ({
  placeholder = 'Search',
  onSearch,
  initialValue = '',
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(400)}
    >
      <View style={[
        styles.searchContainer, 
        { backgroundColor },
        isFocused && styles.searchContainerFocused
      ]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={isFocused ? "#4a6eb5" : placeholderColor} 
          style={styles.searchIcon} 
        />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
          onSubmitEditing={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {searchQuery.length > 0 && Platform.OS !== 'ios' && (
          <TouchableOpacity 
            onPress={clearSearch} 
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={18} color={placeholderColor} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchContainerFocused: {
    borderColor: '#4a6eb5',
    shadowColor: '#4a6eb5',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    fontFamily: 'DMSans_400Regular',
  },
  clearButton: {
    padding: 6,
  },
});

export default SearchBar; 