import React from 'react';
import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface ProcessingPaymentModalProps {
  visible: boolean;
}

const ProcessingPaymentModal: React.FC<ProcessingPaymentModalProps> = ({ visible }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.text}>Payment Processing...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default ProcessingPaymentModal;