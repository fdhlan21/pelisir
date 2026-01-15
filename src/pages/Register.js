import React, { useState,useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  TextInput,
  ScrollView,
  Linking,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { apiURL, LODAY_HEADER, storeData, windowWidth } from '../utils/localStorage';
import { colors } from '../utils/colors';
import Myloading from '../components/Myloading';
import { fonts } from '../utils/fonts';
import MyInput from '../components/MyInput';
import Eye from '../assets/icon/Bold/Eye.svg';
import MyGap from '../components/MyGap';
import MyButton from '../components/MyButton';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import DeviceInfo from 'react-native-device-info';

export default function Register({ navigation, route }) {

  const [kirim, setKirim] = useState({
      nama_lengkap: '',
      username: '',
      email: '',
      telepon: '',
      alamat: '',
      password: '',
    });
  
    
    const updateKirim = (x, v) => {
      setKirim({
        ...kirim,
        [x]: v,
      });
    };
    const [loading, setLoading] = useState(false);
    const sendData = () => {
      if (kirim.username.length == 0) {
       

        Toast.show({
        type:'error',
        text1:'Form wajib di isi',
        text2:'username masih kosong !'
      })


      } else if (kirim.telepon.length == 0) {
          Toast.show({
        type:'error',
        text1:'Form wajib di isi',
        text2:'Telepon masih kosong !'
      })
      } else if (kirim.email.length == 0) {
          Toast.show({
        type:'error',
        text1:'Form wajib di isi',
        text2:'Email masih kosong !'
      })
      } else if (kirim.nama_lengkap.length == 0) {
          Toast.show({
        type:'error',
        text1:'Form wajib di isi',
        text2:'Nama lengkap masih kosong !'
      })
      } else if (kirim.alamat.length == 0) {
          Toast.show({
        type:'error',
        text1:'Form wajib di isi',
        text2:'alamat masih kosong !'
      })
      } else if (kirim.password.length == 0) {
          Toast.show({
        type:'error',
        text1:'Form wajib di isi',
        text2:'kata sandi masih kosong !'
      })
      } else {
        console.log(kirim);
        setLoading(true);
        axios.post(apiURL + 'register', kirim).then(res => {
          console.log(res.data);
          setTimeout(() => {
            setLoading(false);
             Toast.show({
        type:'success',
        text1:'Pendaftaran berhasil',
        text2:res.data.message
      })
            
            navigation.navigate('Login');
          }, 700);
        });
      }
    };







  return (
   
    
     
       <ScrollView style={{
      flex:1,
      height:windowWidth
     }}>
        <ImageBackground
      
      style={styles.container}
      // resizeMode="cover"
    >
       <View
        style={{    
            padding:20,
        }}  
      >
       
       
          <Image source={require('../assets/logo.png')} style={{
            width:250,
            height:100,
            resizeMode:'contain',
            alignSelf:'center'
          }} />
          <MyGap height={10} />
          <MyInput label="Nama Lengkap" onChangeText={x=>setKirim({...kirim,nama_lengkap:x})}  placeholder="Masukan nama lengkap" iconname='user-circle'/>
              
          <MyInput label="Usename" onChangeText={x=>setKirim({...kirim,username:x})}  placeholder="Masukan username" iconname='user-circle'/>
         
     
          <MyInput label="Email" onChangeText={x=>setKirim({...kirim,email:x})}  placeholder="Masukan Email" iconname='letter'/>
         
       
            <MyInput label="Telepon" keyboardType="phone-pad" onChangeText={x=>setKirim({...kirim,telepon:x})}  placeholder="Masukan telepon" iconname='phone-call'/>
          
      
            <MyInput label="Alamat" onChangeText={x=>setKirim({...kirim,alamat:x})}  placeholder="Masukan alamat" iconname='map-point'/>
    
          <MyInput label="Kata sandi" onChangeText={x=>setKirim({...kirim,password:x})}  secureTextEntry={true} placeholder="Masukan kata sandi" iconname='lock-password'/>
          <MyGap height={20} />
        {!loading && (
          <>
          <MyButton title="DAFTAR"  onPress={sendData} />
          <MyGap height={20} />
          <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
            <Text style={{
              textAlign:'center',
              color:colors.primary,
              fontFamily:fonts.secondary[600]
            }}>Sudah memilliki akun ? <Text style={{
              fontFamily:fonts.primary[700],
              color:colors.danger
            }}>masuk disini</Text></Text>
          </TouchableOpacity>
          </>

        )}

        {loading && <Myloading gap={30} />}
      </View>
      
       </ImageBackground>
       </ScrollView>
      
    
   
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,backgroundColor:colors.white },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
