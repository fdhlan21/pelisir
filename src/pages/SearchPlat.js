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

export default function SearchPlat({ navigation, route }) {
    const item =route.params;
  const [kirim, setKirim] = useState({
    seri_wilayah:'',
    value: '',
    seri:'',
  });

  const [loading, setLoading] = useState(false);
  const varifikasi = () => {
    setLoading(true);
    setTimeout(async () => {
     


      const thebody =JSON.stringify({
            method: item.method,
            value: kirim.value,
            seri_wilayah:kirim.seri_wilayah,
            seri:kirim.seri
        })

      const response = await fetch('http://103.129.149.197:7777/plat', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: thebody});

let hasil = await response.json();


    console.log(hasil);
    setLoading(false);
    navigation.navigate('Result',{
        item:item,
        value:kirim.value,
        method:'NOPOL',
        input:`${kirim.seri_wilayah}-${kirim.value}-${kirim.seri}`,
        id_request:hasil.request.id_request
    })

  


    //   navigation.navigate('MpositionDetail')
      // try {
      //   console.log('Kirim data...');
      //   // POST request
      //   const postResponse = await fetch(
      //     'https://keineahnung.online/lodaya/api/v0/request.php',
      //     {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //         username: 'user_api_lodaya',
      //         apikey: 'cxHgA225428BPlyfmzbrH4fgKfccylaCRZdcts70',
      //       },
      //       body: JSON.stringify({
      //         method: 'NIK',
      //         input: { nik: '123123' },
      //         filters: { nama: 'Nova Srimulyani' },
      //       }),
      //     },
      //   );
      //   if (!postResponse.ok) {
      //     const errText = await postResponse.text();
      //     throw new Error(`POST Error ${postResponse.status}: ${errText}`);
      //   }
      //   const postData = await postResponse.json();
      //   console.log('POST Response:', postData);
      // } catch (error) {
      //   console.error(' Error:', error.message);
      // }
    }, 1200);
  };

  return (
    <ImageBackground
      source={require('../assets/back.png')}
      style={[styles.container, { backgroundColor: '#000' }]} // ubah sesuai warna dominan
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
              fontFamily:fonts.primary[700]
              
            }}
          >
            {item.title}
          </Text>
          </View>
          <Text
            style={{
              marginBottom:20,
              color: colors.black,
              fontSize: 14,
              fontFamily:fonts.primary[400]
              
            }}
          >
            {item.detail}
          </Text>
          
         <View style={{
            flexDirection:'row',
            alignItems:'center'
         }}>
            <View style={{
                flex:1,
                paddingHorizontal:2,
            }}>
                 <MyInput nolabel styleInput={{
                    textAlign:'center'
                 }}  onChangeText={x=>setKirim({...kirim,seri_wilayah:x})} iconname={item.icon} placeholder={`D`} label={item.label} />
            </View>
            <View style={{
                flex:2,
                paddingHorizontal:2,
            }}>
                 <MyInput nolabel styleInput={{
                    textAlign:'center'
                 }} onChangeText={x=>setKirim({...kirim,value:x})} iconname={item.icon} placeholder={`${item.label}`} keyboardType={item.keyboard} label={item.label} />
            </View>
            <View style={{
                flex:1,
                paddingHorizontal:2,
            }}>
                 <MyInput nolabel styleInput={{
                    textAlign:'center'
                 }} onChangeText={x=>setKirim({...kirim,seri:x})} iconname={item.icon} placeholder={'LDY'} label={item.label} />
            </View>
         </View>
          <MyGap height={30} />

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
