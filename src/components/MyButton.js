import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

export default function MyButton({
  title,
  backgroundColor = colors.primary,
  onPress,
  radius = 8,
  borderSize = 0,
  textColor = colors.white,
  borderColor = colors.primary,
}) {
  return (
    <TouchableOpacity
      style={
        {
          height: Platform.OS=="android"?45:45,
          borderRadius: radius,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: backgroundColor,
          borderWidth: borderSize,
          borderColor: borderColor,
        }
      }
      onPress={onPress}>
      <Text
        style={{
          fontFamily:fonts.secondary[700],
          color: textColor,
          fontSize:12,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

