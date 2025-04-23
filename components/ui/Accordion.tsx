import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';

interface AccordionProps {
    title: string;
    children: React.ReactNode;
}

const AccordionItem = ({children}: {children: React.ReactNode}) => {
    return(
        <View style={{marginVertical: 7}}>
            {children}
        </View>
    )
}

const Accordion = ({ title, children }: AccordionProps) => {
    const [expanded, setExpanded] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
  
    const toggleAccordion = () => {
      Animated.timing(animation, {
        toValue: expanded ? 0 : 1,
        duration: 200,
        useNativeDriver: true, // Required for scale animations
      }).start();
      setExpanded(!expanded);
    };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleAccordion}>
        <ThemedText type='title'>{title}</ThemedText>
        <AntDesign name={expanded ? 'minus' : 'plus'} size={20} color="black" />
      </TouchableOpacity>
      {expanded && <View style={styles.innerContent}>
          {children}
        </View>}
    </View>
  );
};

Accordion.Item = AccordionItem;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    overflow: 'hidden',
  },
  innerContent: {
  },
});

export default Accordion;
