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

export default function Login({ navigation, route }) {

  const [kirim, setKirim] = useState({
      username: '',
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
          text1:'Username masih kosong !',
          text2:'Silahkan masukan username'
        })
      } else if (kirim.password.length == 0) {
        
      Toast.show({
          type:'error',
          text1:'Kata sandi masih kosong !',
          text2:'Silahkan masukan kata sandi'
      });
      } else {
        // console.log(kirim);
        setLoading(true);
        axios.post(apiURL + 'login', kirim).then(res => {
          setTimeout(() => {
            setLoading(false);
            if (res.data.status == 200) {
              storeData('user', res.data.data);
              navigation.replace('Maintabs');
            } else {
              
               Toast.show({
              type:'error',
              text1:'Ada kesalahan saat login',
              text2:res.data.message
            });
            }
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
          // flex:1,
          marginTop:50,
          paddingHorizontal: 20,
          
        }}
      >
        <Image
          source={require('../assets/logo.png')}
          style={{
            width: windowWidth,
            height:  windowWidth/3,
            resizeMode:'contain',
          }}
        />

         <Text
          style={{
            marginBottom: 20,
            fontFamily: fonts.secondary[800],
            fontSize: 30,
            textAlign:'center'
          }}>
          Masuk
        </Text>

          <MyInput label="Username" onChangeText={x=>setKirim({...kirim,username:x})}  placeholder="Masukan username" iconname='user-circle'/>
          
          <MyInput label="Kata Sandi" onChangeText={x=>setKirim({...kirim,password:x})}  secureTextEntry={true} placeholder="Masukan kata sandi" iconname='lock-password'/>
          <MyGap height={20} />
        {!loading && (
          <>
          <MyButton title="MASUK"  onPress={sendData} />
          <MyGap height={20} />
          <TouchableOpacity onPress={()=>navigation.navigate('Register')}>
            <Text style={{
              textAlign:'center',
              color:colors.primary,
              fontFamily:fonts.secondary[600]
            }}>Belum memilliki akun ? <Text style={{
              fontFamily:fonts.secondary[700],
              color:colors.danger
            }}>daftar disini</Text></Text>
          </TouchableOpacity>
          </>

        )}

        {loading && <Myloading gap={30} />}
      </View>
      <MyGap height={300} />
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
