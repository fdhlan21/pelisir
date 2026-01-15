import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React,{useEffect,useState} from 'react'
import { apiURL, storeData } from '../utils/localStorage';
import { colors } from '../utils/colors';
import MyHeader from '../components/MyHeader';
import MyInput from '../components/MyInput';
import MyButton from '../components/MyButton';
import MyLoading from '../components/Myloading';
import MyGap from '../components/MyGap';
import Toast from 'react-native-toast-message';
import axios from 'axios';
export default function AccoountEdit({navigation,route}) {
   const [kirim, setKirim] = useState(route.params);
    const [loading, setLoading] = useState(false);
    
    const sendServer = () => {
      // setLoading(true);
      console.log(kirim);
      axios.post(apiURL + 'update_profile', kirim).then(res => {
        console.log(res.data);
  
        setLoading(false);
  
        if (res.data.status == 200) {
          storeData('user', res.data.data);
          navigation.replace('Maintabs');
         Toast.show({
            type:'success',
            text1:'berhasil diupdate',
            text2:'Profil berhasil diupdate !'
         })
        }
      });
    };
  
    useEffect(() => {
      setKirim({
        ...kirim,
        newfoto_user: null,
      });
    }, []);
  
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <MyHeader title="Edit Profile" onPress={() => navigation.goBack()} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingHorizontal: 20,
          }}>
          {/* <View style={{
                      padding: 10,
                      justifyContent: 'center',
                      alignItems: 'center'
                  }}>
                      <TouchableOpacity onPress={() => {
  
  
                          launchImageLibrary({
                              includeBase64: true,
                              quality: 1,
                              mediaType: "photo",
                              maxWidth: 200,
                              maxHeight: 200
                          }, response => {
                              // console.log('All Response = ', response);
  
                              setKirim({
                                  ...kirim,
                                  newfoto_user: `data:${response.type};base64, ${response.base64}`,
                              });
                          });
  
  
  
                      }} style={{
                          width: 100,
                          height: 100,
                          borderWidth: 1,
                          borderColor: Color.blueGray[100],
                          overflow: 'hidden',
                          borderRadius: 20,
                          justifyContent: 'center',
                          alignItems: 'center'
                      }}>
                          <Image style={{
                              width: 100,
                              height: 100,
                          }} source={{
                              uri: kirim.newfoto_user !== null ? kirim.newfoto_user : kirim.foto_user,
                          }} />
                      </TouchableOpacity>
                  </View> */}
  
          <MyInput
            label="Username"
            iconname="user-circle"
            value={kirim.username.toString()}
            onChangeText={x => setKirim({...kirim, username: x})}
          />
  
          <MyInput
            label="Email"
            iconname="letter"
            value={kirim.email}
            onChangeText={x => setKirim({...kirim, email: x})}
          />
  
          <MyInput
            label="Nama Lengkap"
             iconname="user-circle"
            value={kirim.nama_customer}
            onChangeText={x => setKirim({...kirim, nama_customer: x})}
          />
  
          <MyInput
            label="Telepon"
            iconname="phone-call"
            keyboardType="phone-pad"
            value={kirim.telepon_customer}
            onChangeText={x => setKirim({...kirim, telepon_customer: x})}
          />
  
          <MyInput
            label="Alamat"
            iconname="map-point"
            value={kirim.alamat_customer}
            onChangeText={x => setKirim({...kirim, alamat_customer: x})}
          />
  
          <MyInput
            label="Password"
            iconname="lock-password"
            secureTextEntry={true}
            onChangeText={x => setKirim({...kirim, newpassword: x})}
            placeholder="Kosongkan jika tidak diubah"
          />
          <MyGap height={20} />
          {loading && <MyLoading />}
  
          {!loading && (
            <MyButton
              warna={colors.secondary}
              colorText={colors.white}
              iconColor={colors.white}
              onPress={sendServer}
              title="Simpan Perubahan"
              Icons="download-outline"
            />
          )}
          <MyGap jarak={20} />
        </ScrollView>
      </View>
    );
  }
  
  const styles = StyleSheet.create({});
  