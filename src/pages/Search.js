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
  KeyboardAvoidingView
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
import { ScrollView } from 'react-native';

export default function Search({ navigation, route }) {
    const item =route.params;
    console.log(item.filter)
  const [kirim, setKirim] = useState({
    method:item.method,
    input: '',
    filter:[]
  });

  const [loading, setLoading] = useState(false);
  const varifikasi = async () => {
    // console.log(kirim);
    // setLoading(true);
        const thebody = JSON.stringify({
            method: item.method,
            input: kirim.input,
            filter:{
              [item.method.toLowerCase()]:kirim.input,
              ...kirim.filter
            },
        })

        console.log(thebody);

        const response = await fetch(process.env.API_URL_LOCAL + '/usermin', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: thebody});

        const hasil = await response.json();
        

        


   

    if(item.method=='NIK' || item.method=='MSISDN'){
      const thebody2 = JSON.stringify({
            method: 'PHOTO',
            input: kirim.input,
            filter:{'photo':kirim.input},
        })

        console.log(thebody2);
        const response2 = await fetch(process.env.API_URL_LOCAL + '/usermin', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: thebody2});
        const hasil2 = await response2.json();
           setLoading(false);
           
      navigation.navigate('Result',{
          item:item,
          value:kirim.input,
          input:kirim.input,
          method:item.method,
          id_request_photo:hasil2.request.id_request,
          id_request:hasil.request.id_request
      });
    }else{
   setLoading(false);
      navigation.navigate('Result',{
          item:item,
          value:kirim.input,
          input:kirim.input,
          method:item.method,
          id_request_photo:0,
          id_request:hasil.request.id_request
      });
    }

   

    // setLoading(true);
    // setTimeout(async () => {
    

    //   let thebody =JSON.stringify({});

    //   if(item.method=='NIK'){
    //     thebody =JSON.stringify({
    //         method: item.method,
    //         input: kirim.value,
    //         filters:kirim.value,
    //         inputdata:'nik',
    //         filtersdata:'nik'
    //     })
    //   }else if(item.method=='KK'){
    //     thebody =JSON.stringify({
    //         method: item.method,
    //         input: kirim.value,
    //         filters:kirim.value,
    //         inputdata:'',
    //         filtersdata:'nkk'
    //     })
    //   }else if(item.method=='NAMA'){
    //     thebody =JSON.stringify({
    //         method: item.method,
    //         input: kirim.value,
    //         filters:kirim.value,
    //         inputdata:'',
    //         filtersdata:'nama'
    //     })
    //   }else if(item.method=='MSISDN'){
    //     thebody =JSON.stringify({
    //         method: item.method,
    //         input: kirim.value,
    //         filters:kirim.value,
    //         inputdata:'',
    //         filtersdata:'msisdn'
    //     })
    //   }else if(item.method=='IMEI'){
    //     thebody =JSON.stringify({
    //         method: item.method,
    //         input: kirim.value,
    //         filters:kirim.value,
    //         inputdata:'',
    //         filtersdata:'imei'
    //     })
    //   }else if(item.method=='EMAIL'){
    //     thebody =JSON.stringify({
    //         method: item.method,
    //         input: kirim.value,
    //         filters:kirim.value,
    //         inputdata:'',
    //         filtersdata:'email'
    //     })
    //   }else if(item.method=='USERNAME'){
    //     thebody =JSON.stringify({
    //         method: item.method,
    //         input: kirim.value,
    //         filters:kirim.value,
    //         inputdata:'',
    //         filtersdata:'username'
    //     })
    //   }else if(item.method=='NOKA'){
    //     thebody =JSON.stringify({
    //         method: item.method,
    //         input: kirim.value,
    //         filters:kirim.value,
    //         inputdata:'',
    //         filtersdata:'noka'
    //     })
    //   }else if(item.method=='NOSIN'){
    //     thebody =JSON.stringify({
    //         method: item.method,
    //         input: kirim.value,
    //         filters:kirim.value,
    //         inputdata:'',
    //         filtersdata:'nosin'
    //     })
    //   }else if(item.method=='BPKB'){
    //     thebody =JSON.stringify({
    //         method: item.method,
    //         input: kirim.value,
    //         filters:kirim.value,
    //         inputdata:'',
    //         filtersdata:'no_bpkb'
    //     })
    //   }else if(item.method=='NOREK'){
    //     thebody =JSON.stringify({
    //         method: item.method,
    //         input: kirim.value,
    //         filters:kirim.value,
    //         inputdata:'',
    //         filtersdata:'norek'
    //     })
    //   }else if(item.method=='PHOTO'){
    //     thebody =JSON.stringify({
    //         method: item.method,
    //         input: kirim.value,
    //         filters:kirim.value,
    //         inputdata:'',
    //         filtersdata:'photo'
    //     })
    //   }else{
    //     alert('onProgress')
    //   }

    // const response = await fetch(process.env.API_URL_LOCAL + '/usermin', {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: thebody});

    // let hasil = await response.json();


    // console.log(hasil);
  
    // }, 800);
  
  
  };


   function formatKey(key) {
  const isAllCaps = /^[A-Z0-9_]+$/.test(key); // cek ALL CAPS

  if (isAllCaps) {
    return key.replace(/_/g, " ").trim(); // NIK, NO_KK → NO KK
  }

  return key
    .replace(/_/g, " ")                // underscore → spasi
    .replace(/([A-Z])/g, " $1")        // camelCase → pisah
    .replace(/\s+/g, " ")              // rapikan spasi
    .trim()
    .toLowerCase()                     // buat kecil semua dulu
    .replace(/\b\w/g, (c) => c.toUpperCase()); // kapital awal kata
}

const [collapse,setCollapse] = useState(false);

  return (
    <ImageBackground
      source={require('../assets/back.png')}
      style={[styles.container, { backgroundColor: colors.primary }]} // ubah sesuai warna dominan
      //   resizeMode="cover"
    >
       <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    style={{ flex: 1 }}
  >
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 10,
      }}
      keyboardShouldPersistTaps="handled"
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
                           height: 100,
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
            {item.title} {item.method}
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
         
            <MyInput  onChangeText={x=>setKirim({...kirim,input:x})} iconname={item.icon} placeholder={`${item.label}`} label={item.label} />
            


            {item.filter.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                
                setCollapse(!collapse);
              }}
              style={{
                backgroundColor: colors.blueGray[400],
                padding: 10,
                borderRadius: 10,
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <MyIcon name="filter" size={16} color="white" />
              <Text
                style={{
                  color: 'white',
                  marginLeft: 10,
                  fontFamily: fonts.primary[600],
                  fontSize: 12
                }}
              >
                Opsi Filter {collapse ? '(Sembunyikan)' : '(Tampilkan)'}
              </Text>
            </TouchableOpacity>
          )}

            {collapse && item.filter.length > 0 && (
              <View style={{ marginTop: 10 }}>
                {item.filter.map((i, idx) => (
                  <View key={idx}>
                    <MyGap height={10} />
                    <MyInput
                      onChangeText={x =>
                        setKirim(prev => ({
                            ...prev,
                            filter: {
                              ...prev.filter,
                              [i]: x,   // langsung assign key → value
                            },
                          }))
                      }
                      iconname={item.icon}
                      placeholder={`${formatKey(i.replace("_match_natural","").replace("_prefix"," %")).toLowerCase()}`}
                      label={formatKey(i.replace("_match_natural","").replace("_prefix"," %"))}
                    />
                  </View>
                ))}
              </View>
            )}

           <MyGap height={10} />
          </View>

          {!loading && (
           <>
            <MyButton title="Submit" onPress={varifikasi} />
            <MyGap height={40} />
           </>
            
          )}

          {loading && <Myloading gap={30} />}

          

      
        </View>
      </View>
       
      </ScrollView>
      </KeyboardAvoidingView>
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
    expandButton: { paddingVertical: 8 },
    expandText: {
      fontSize: 14,
      fontFamily:fonts.secondary[700],
      color: "blue",
      textDecorationLine: "underline",
    },
});

