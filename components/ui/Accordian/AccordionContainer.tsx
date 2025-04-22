import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Platform, 
  UIManager 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface AccordionContainerProps {
  title: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
}

const AccordionContainer = ({ title, children, initiallyExpanded = false }: AccordionContainerProps) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const contentRef = useRef<View>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const measureContent = () => {
    if (contentRef.current) {
      contentRef.current.measure((x, y, width, height) => {
        setContentHeight(height);
      });
    }
  };

  const toggleAccordion = () => {
    if (expanded) {
      // Collapsing
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start(() => {
        setExpanded(false);
      });
    } else {
      // Expanding
      setExpanded(true);
      // We need to wait for the next frame to measure the content height
      setTimeout(() => {
        Animated.timing(heightAnim, {
          toValue: contentHeight,
          duration: 150,
          useNativeDriver: false,
        }).start();
      }, 10);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleAccordion}
        activeOpacity={0.8}
      >
        <ThemedText type='title'>{title.toUpperCase()}</ThemedText>
        <Ionicons 
          name={expanded ? "remove" : "add"} 
          size={24} 
          color="#333" 
        />
      </TouchableOpacity>
      
      {expanded && (
        <Animated.View 
          style={[
            styles.contentContainer,
            { height: heightAnim }
          ]}
          onLayout={measureContent}
        >
          <View ref={contentRef} style={styles.content}>
            {children}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    // marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  contentContainer: {
    overflow: 'hidden',
    paddingVertical: 16,
  },
  content: {
    position: 'absolute',
    width: '100%',
  },
});

export default AccordionContainer;