import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ThemedText } from '../ThemedText'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

interface CommonHeaderProps {
  title: string
  showBack?: boolean
  onBackPress?: () => void
  rightComponent?: React.ReactNode
  leftComponent?: React.ReactNode
}

const CommonHeader = ({ 
  title, 
  showBack = true, 
  onBackPress, 
  rightComponent,
  leftComponent
}: CommonHeaderProps) => {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress()
    } else {
      router.back()
    }
  }

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )}
        {leftComponent}
      </View>
      
      <ThemedText style={styles.title} numberOfLines={1}>{title}</ThemedText>
      
      {rightComponent && (
        <View style={styles.rightSection}>
          {rightComponent}
        </View>
      )}
    </View>
  )
}

export default CommonHeader

const styles = StyleSheet.create({
     header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
   backButton: {
    marginRight: 16,
  },
   title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
 
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 40,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 40,
    justifyContent: 'flex-end',
  },
})