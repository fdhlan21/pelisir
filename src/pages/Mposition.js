import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { windowWidth } from '../utils/localStorage';
import { colors } from '../utils/colors';
import Myloading from '../components/Myloading';
import axios from 'axios';

export default function MPosition({ navigation, route }) {
  const [kirim, setKirim] = useState({
    telepon: '',
  });

  const [loading, setLoading] = useState(false);
  const varifikasi = () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      navigation.navigate('MpositionDetail')
    }, 1200);
  };

  return (
    <ImageBackground
      // source={require('../assets/backto.png')}
      style={[styles.container, { backgroundColor: '#000' }]} // ubah sesuai warna dominan
      //   resizeMode="cover"
    >
      <View
        style={{
          paddingTop: Platform.OS == 'android' ? 40 : 50,
        }}
      >
        <Image
          // source={require('../assets/logow.png')}
          style={{
            width: 200,
            height: 50,
            // resizeMode: 'contain',
            alignSelf: 'flex-end',
          }}
        />

        <View
          style={{
            padding: 20,
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: 25,
              fontWeight: 'bold',
              marginBottom: 10,
            }}
          >
            POSITION CHECK
          </Text>
          <Text
            style={{
              color: colors.white,
              marginBottom: 5,
            }}
          >
            Enter Number phone
          </Text>
          <TextInput
            keyboardType="phone-pad"
            placeholder="Enter number phone"
            onChangeText={x => setKirim({ ...kirim, telepon: x })}
            style={{
              padding: 0,
              paddingLeft: 10,
              lineHeight: 0,
              height: Platform.OS == 'android' ? 45 : 50,
              backgroundColor: colors.white,
              borderRadius: 10,
            }}
          />
          {!loading && (
            <TouchableOpacity
              onPress={varifikasi}
              style={{
                marginTop: 20,
                padding: 10,
                height: Platform.OS == 'android' ? 45 : 50,
                backgroundColor: colors.primary,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: colors.white,
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          )}

          {loading && <Myloading gap={30} />}

      
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
