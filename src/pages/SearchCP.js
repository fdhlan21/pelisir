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
import MyIcon from '../components/MyIcon';
import { fonts } from '../utils/fonts';
import MyButton from '../components/MyButton';
import MyGap from '../components/MyGap';
import MyInput from '../components/MyInput';

export default function SearchCP({ navigation, route }) {
  
 const item =route.params;
   
  const [kirim, setKirim] = useState({
    telepon:'',
    method:'cp',
  });

  const [loading, setLoading] = useState(false);
  const varifikasi = async () => {
  if (kirim.telepon.length === 0) {
    Toast.show({
      type: 'error',
      text1: 'Phone number is empty!',
      text2: 'Please enter phone number',
    });
    return;
  }

  setLoading(true);

  try {
    const thebody = JSON.stringify({
      input: kirim.telepon,
      method: kirim.method,
    });

    const response = await fetch(`${process.env.API_URL}/cp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: thebody,
    });

    // 🔥 Cek apakah server merespons OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const hasil = await response.json();
    console.log('📩 Response:', hasil);
    setLoading(false);

    // ✅ Handle hasil yang valid
    if (hasil.ok && hasil.data?.status) {
      navigation.navigate('MpositionDetail', {
        item: hasil.data.result,
        input: hasil.data.input,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Nomor telepon tidak dapat diproses',
        text2: hasil?.message || 'Provider sedang maintenance',
      });
    }
  } catch (error) {
    // ❌ Handle jika gagal fetch atau parse JSON
    console.log('error')
    setLoading(false);
    Toast.show({
      type: 'error',
      text1: 'Koneksi gagal',
      text2: error.message.includes('Network') 
        ? 'Tidak dapat terhubung ke server' 
        : 'Terjadi kesalahan pada server',
    });
  }
};


  return (
    <ImageBackground
      source={require('../assets/back.png')}
      style={[styles.container, { backgroundColor: colors.primary }]} // ubah sesuai warna dominan
      //   resizeMode="cover"
    >
      <View
        style={{
          paddingTop: Platform.OS == 'android' ? 40 : 50,
        }}
      >
        <Image
                         source={require('../assets/logo.png')}
                         style={{
                           width: 300,
                           height: 200,
                           alignSelf: 'center',
                         }}
                       />
                 

        <View
          style={{
            padding: 20,
          }}
        >
          <View style={{
            marginTop:'10%',
          }}>
            <View style={{
            flexDirection:'row',
            alignItems:'center'
          }}>
            <MyIcon name={item.icon} color={colors.danger} size={30} />
            <Text
            style={{
                flex:1,
                marginLeft:5,
              color: colors.black,
              fontSize: 25,
              fontFamily:fonts.primary[700],
            
              
            }}
          >
            {item.title}
          </Text>
          </View>
          <Text
            style={{
              color: colors.black,
              fontSize: 14,
              fontFamily:fonts.primary[400]              
            }}
          >
            {item.detail}
          </Text>
           <View style={{
            marginTop:10,
            flexDirection:'row',
            justifyContent:'space-around'
          }}>
              <TouchableOpacity onPress={()=>setKirim({...kirim,method:'cp'})} style={{
                backgroundColor:kirim.method=='cp'?colors.danger:colors.white,
                justifyContent:'center',
                width:windowWidth/2.3,
                paddingVertical:5,
                borderRadius:10,
              }}>
                
                <Text style={{
                  fontFamily:fonts.secondary[600],
                  fontSize:9,
                  textAlign:'center',
                  color:kirim.method=='cp'?colors.white:colors.black,
                }}>Track</Text>
              </TouchableOpacity>
                <TouchableOpacity onPress={()=>setKirim({...kirim,method:'cpall'})} style={{
                  paddingVertical:5,
                backgroundColor:kirim.method=='cpall'?colors.danger:colors.white,
                justifyContent:'center',
                width:windowWidth/2.3,
                borderRadius:10,
              }}>
                
                <Text style={{
                  fontFamily:fonts.secondary[600],
                  fontSize:9,
                  textAlign:'center',
                  color:kirim.method=='cpall'?colors.white:colors.black

                }}>Track 1</Text>
              </TouchableOpacity>
          </View>
         
            <MyInput  onChangeText={x=>setKirim({...kirim,telepon:x})} iconname={item.icon} placeholder={`${item.label}`} label={item.label} />
           <MyGap height={10} />
          </View>

          {!loading && (
            <MyButton title="Submit" onPress={varifikasi} />
            
          )}

          {loading && <Myloading gap={30} />}

          

      
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontFamily:fonts.primary[700], marginBottom: 20 },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
