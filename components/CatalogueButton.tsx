import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Colors from '../constants/Colors';

export default function CatalogueButton({ style, ...props }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      {...props}
    >
      <Text style={styles.text}>CATALOGUE</Text>
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
    backgroundColor: '#FFFFFF', // White background
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000', // Black text
    textAlign: 'center',
    lineHeight: 18,
  },
});
