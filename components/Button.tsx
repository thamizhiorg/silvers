import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Colors from '../constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'outline';
}

export default function Button({ title, variant = 'primary', style, ...props }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        variant === 'outline' ? styles.outlineButton : styles.primaryButton,
        style
      ]} 
      {...props}
    >
      <Text 
        style={[
          styles.text, 
          variant === 'outline' ? styles.outlineText : styles.primaryText
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  primaryText: {
    color: Colors.background,
  },
  outlineText: {
    color: Colors.primary,
  },
});
