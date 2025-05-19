import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet, Dimensions } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Button from './ui/Button';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';

const SORT_OPTIONS = [
  { label: 'Newest', value: 'createdAt' },
  { label: 'Highest Price', value: 'price' },
  { label: 'Lowest Price', value: '-price' },
];

interface SortAndFilterProps {
  onSortChange: (value: string) => void;
  onFilterChange: (value: number[]) => void;
  filterRange?: number [];
  selectedSort: string;
  initialRange?: number[]
}

export default function SortAndFilter({
  onSortChange,
  onFilterChange,
  filterRange = [0, 1000],
  selectedSort,
  initialRange = [0, 1000],
}: SortAndFilterProps) {
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [range, setRange] = useState(initialRange);

  const handleSortSelect = (option: {label: string, value: string}) => {
    setSortModalVisible(false);
    onSortChange && onSortChange(option.value);
  };

  const handleFilterChange = (values: number[]) => {
    setRange(values);
  };

  const handleFilterApply = () => {
    setFilterModalVisible(false);
    onFilterChange && onFilterChange(range);
  };

  return (
    <View style={styles.container}>
      {/* Sort Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setSortModalVisible(true)}
      >
        <ThemedText style={styles.buttonText} type='subtitle'>SORT</ThemedText>
        <Ionicons size={18} name='add' />
      </TouchableOpacity>

      {/* Filter Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setFilterModalVisible(true)}
      >
        <ThemedText style={styles.buttonText} type='subtitle'>FILTER</ThemedText>
        <Ionicons size={18} name='filter' />
      </TouchableOpacity>

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setSortModalVisible(false)}
        >
          <View style={styles.dropdown}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownItem,
                ]}
                onPress={() => handleSortSelect(option)}
              >
                <View style={styles.radioContainer}>
                  {selectedSort === option.value && <View style={styles.selectedRadio} />}
                </View>
                <ThemedText>{option.label}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setFilterModalVisible(false)}
        >
          <View style={styles.dropdown}>
          <ThemedText type='subtitle' style={{marginVertical: 10, textTransform: "uppercase"}}>Price Range</ThemedText>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
              <ThemedText type='title'>{range[0]}.00 Rs.</ThemedText>
              <ThemedText type='title'>{range[1]}.00 Rs.</ThemedText>
            </View>
            <MultiSlider
              values={range}
              min={filterRange[0]}
              max={filterRange[1]}
              onValuesChange={handleFilterChange}
              minMarkerOverlapDistance={20}
              selectedStyle={{backgroundColor: "#000"}}
              trackStyle={{backgroundColor: "#00000080"}}
              sliderLength={Dimensions.get("window").width - 40}
              customMarker={() => <View style={styles.customMarker} />}
            />
            <Button title='Apply' onPress={handleFilterApply} style={{marginTop: 15}} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  button: {
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center"
  },
  buttonText: {
    fontSize: 16,
    marginRight: 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 20,
    minWidth: 220,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    justifyContent: "center",
    // alignItems: 'center',
    width: "100%",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  radioContainer: {
    height: 18,
    width: 18,
    borderRadius: 100,
    borderWidth: 2,
    marginRight: 10,
    padding: 3
  },
  selectedRadio: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    backgroundColor: "#000"
  },
  selectedDropdownItem: {
    backgroundColor: '#00000010',
    borderRadius: 4,
  },
  customMarker: {
    backgroundColor: "#000",
    height: 12,
    width: 12,
  }
}); 