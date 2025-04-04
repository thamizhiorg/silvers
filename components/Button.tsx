import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Colors from '../constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'outline' | 'silver';
}

export default function Button({ title, variant = 'primary', style, ...props }: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineButton;
      case 'silver':
        return styles.silverButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      case 'silver':
        return styles.silverText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        style
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          getTextStyle()
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
  silverButton: {
    backgroundColor: '#808080', // Silver color
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.background,
  },
  outlineText: {
    color: Colors.primary,
  },
  silverText: {
    color: Colors.background,
  },
});
