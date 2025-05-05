import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Address } from '@/store/addressStore';

interface AddressCardProps {
  address: Address;
  onSetDefault: (id: string) => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onSetDefault,
  onEdit,
  onDelete
}) => {
  return (
    <View style={[
      styles.container, 
      address.isDefault && styles.defaultContainer
    ]}>
      {/* Default badge */}
      {address.isDefault && (
        <View style={styles.defaultBadge}>
          <ThemedText style={styles.defaultText}>Default</ThemedText>
        </View>
      )}
      
      {/* Address info */}
      <View style={styles.addressInfo}>
        <ThemedText style={styles.name}>{address.name}</ThemedText>
        <ThemedText style={styles.addressLine}>{address.line1}</ThemedText>
        {address.line2 && <ThemedText style={styles.addressLine}>{address.line2}</ThemedText>}
        <ThemedText style={styles.addressLine}>
          {address.city}, {address.state} {address.postalCode}
        </ThemedText>
        <ThemedText style={styles.addressLine}>{address.country}</ThemedText>
        <ThemedText style={styles.phone}>
          <Ionicons name="call-outline" size={14} color="#555" />
          {' '}{address.phone}
        </ThemedText>
      </View>
      
      {/* Actions */}
      <View style={styles.actionsContainer}>
        {/* Show "Set as Default" button only if not already default */}
        {!address.isDefault && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onSetDefault(address.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#4a6eb5" />
            <ThemedText style={[styles.actionText, styles.defaultActionText]}>Set as Default</ThemedText>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEdit(address)}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={18} color="#4a6eb5" />
          <ThemedText style={[styles.actionText, styles.editText]}>Edit</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onDelete(address.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color="#e74c3c" />
          <ThemedText style={[styles.actionText, styles.deleteText]}>Delete</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  defaultContainer: {
    borderColor: '#4a6eb5',
    borderWidth: 2,
    shadowColor: '#4a6eb5',
    shadowOpacity: 0.2,
  },
  defaultBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4a6eb5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  defaultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addressInfo: {
    marginBottom: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  addressLine: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
    lineHeight: 20,
  },
  phone: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
  defaultActionText: {
    color: '#4a6eb5',
  },
  editText: {
    color: '#4a6eb5',
  },
  deleteText: {
    color: '#e74c3c',
  },
});

export default AddressCard; 