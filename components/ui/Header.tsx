import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

interface HeaderProps {
  onPress?: () => void;
}

const Header = (props: HeaderProps) => {
  const {onPress} = props
  return (
    <View style={{padding: 16}}>
      <TouchableOpacity onPress={onPress}>
        <Ionicons name='arrow-back' size={24} />
      </TouchableOpacity>
    </View>
  )
}

export default Header