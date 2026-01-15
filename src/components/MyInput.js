import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';

import { fonts } from '../utils/fonts';
import MyIcon from './MyIcon';
import { colors } from '../utils/colors';

export default function MyInput({
  onFocus,
  label,
  nolabel = false,
  borderColor,
  backgroundColor = colors.background_input,
  editable,
  icon = true,
  maxLength,
  autoCapitalize,
  iconname = 'user-rounded',
  onChangeText,
  value,
  borderWidth = 0,
  textColor = colors.primary,
  keyboardType,
  secureTextEntry,
  styleInput,
  onSubmitEditing,
  placeholder,
  autoFocus,
  multiline,
  label2,
  styleLabel,
  colorIcon = colors.primary,
  ref
}) {


  const [tutup, setTutup] = useState(true);

  const inputRef = useRef();
  return (
    <View style={{
      marginVertical:10,
    }}>
      {!nolabel && 
        <Text style={{
        fontFamily:fonts.secondary[600],
        color: colors.primary,
        marginBottom: 8,
        position:'relative'
      }}>{label}</Text>
      }
      <View style={{
        height: 50,
        
      }}>
        {!nolabel && <View style={{
          position: 'absolute',
          left: 12,
          top: 13,
          zIndex:1
        }}>
          <MyIcon name={iconname} color={colors.primary} size={24} />
        </View>}
        <TextInput autoCapitalize={autoCapitalize}  secureTextEntry={secureTextEntry ? tutup : false} maxLength={maxLength} keyboardType={keyboardType} onChangeText={onChangeText} value={value} placeholderTextColor={colors.blueGray[400]} placeholder={placeholder} style={{
          ...styleInput,
          flex: 1,
          paddingLeft: !nolabel?44:0,
          height: 50,
          backgroundColor:colors.blueGray[200],
          borderWidth:0,
          fontFamily:fonts.secondary[600],
          borderColor:colors.white,
          paddingHorizontal: 12,
          color: colors.black,
          // borderWidth: 1,
          borderRadius: 8,
         
        }} />

         {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setTutup(!tutup)}
            style={{
              paddingHorizontal: 10,
              justifyContent: 'center',
              position:'absolute',
              right:0,
              alignItems: 'center',
              height: '100%',
            }}>

              <MyIcon name={!tutup ? 'eye-closed' : 'eye'} color={colors.primary} size={24} />
           
          </TouchableOpacity>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
