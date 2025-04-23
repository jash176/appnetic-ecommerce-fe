import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface SizeGuideProps {
  sizeGuideData?: {
    title: string;
    measurements: {
      size: string;
      chest: string;
      waist: string;
      hips: string;
    }[];
  };
}

const defaultSizeGuideData = {
  title: "Size Guide",
  measurements: [
    { size: "XS", chest: "32-34", waist: "24-26", hips: "34-36" },
    { size: "S", chest: "34-36", waist: "26-28", hips: "36-38" },
    { size: "M", chest: "36-38", waist: "28-30", hips: "38-40" },
    { size: "L", chest: "38-40", waist: "30-32", hips: "40-42" },
    { size: "XL", chest: "40-42", waist: "32-34", hips: "42-44" },
  ]
};

const SizeGuide = ({ sizeGuideData = defaultSizeGuideData }: SizeGuideProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = Dimensions.get('window');

  return (
    <>
      <TouchableOpacity 
        style={styles.sizeGuideButton}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText type="link">Size Guide</ThemedText>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: width - 32 }]}>
            <View style={styles.modalHeader}>
              <ThemedText type="title">{sizeGuideData.title}</ThemedText>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <ThemedText type="subtitle" style={styles.headerCell}>Size</ThemedText>
                <ThemedText type="subtitle" style={styles.headerCell}>Chest</ThemedText>
                <ThemedText type="subtitle" style={styles.headerCell}>Waist</ThemedText>
                <ThemedText type="subtitle" style={styles.headerCell}>Hips</ThemedText>
              </View>

              {sizeGuideData.measurements.map((measurement, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.tableRow,
                    index % 2 === 0 && styles.evenRow
                  ]}
                >
                  <ThemedText style={styles.cell}>{measurement.size}</ThemedText>
                  <ThemedText style={styles.cell}>{measurement.chest}</ThemedText>
                  <ThemedText style={styles.cell}>{measurement.waist}</ThemedText>
                  <ThemedText style={styles.cell}>{measurement.hips}</ThemedText>
                </View>
              ))}
            </View>

            <View style={styles.footer}>
              <ThemedText type="subtitle" style={styles.note}>
                All measurements are in inches
              </ThemedText>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  sizeGuideButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerCell: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  cell: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  note: {
    color: '#666',
  },
});

export default SizeGuide; 