import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Animated,
  ImageBackground,
  SafeAreaView,
} from 'react-native';


import { getData } from '../utils/localStorage';
import { colors } from '../utils/colors';
import { fonts, windowWidth } from '../utils/fonts';

export default function Splash({navigation}) {
  const img = new Animated.Value(0.5);
  const textScale = new Animated.Value(0.5);
  const textOpacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(img, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(textScale, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
       navigation.replace('Home');
    }, 1500);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Animated.Image
        source={require('../assets/logo.png')}
        resizeMode="contain"
        style={{
          transform: [{scale: img}],
          width: windowWidth / 2,
          height: windowWidth / 2,
        }}
      />
      <Text style={{
        fontFamily:fonts.secondary[800],
        fontSize:60,
        color:colors.primary,
      }}>PELISIR</Text>
        {/* <Text style={{
        fontFamily:fonts.secondary[600],
        fontSize:18,
        color:colors.secondary,
      }}>Aplikasi Alarm Minum Obat</Text> */}

      {/* <Text style={{
        marginTop:20,
        fontFamily:fonts.secondary[800],
        fontSize:14,
        color:colors.black,
      }}>by MARIDA SAKDIAH</Text> */}

      <View
        style={{
          marginTop: 50,
        }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
