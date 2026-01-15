import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  Alert,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getData, LODAY_HEADER, MYAPP, storeData, windowWidth } from '../utils/localStorage';
import { colors } from '../utils/colors';
import Myloading from '../components/Myloading';
import { fonts } from '../utils/fonts';
import axios from 'axios';
import moment from 'moment';
import MyButton from '../components/MyButton';
import MyGap from '../components/MyGap';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';
import MyHeader from '../components/MyHeader';

export default function Account({ navigation, route }) {
const [user, setUser] = useState({});
  const [com, setCom] = useState({});
  const isFocused = useIsFocused();
  const [wa, setWA] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getData('user').then(res => {
        console.log(res);
        setOpen(true);
        setUser(res);
      });
    }
  }, [isFocused]);

  const btnKeluar = () => {
    Alert.alert(MYAPP, 'Apakah kamu yakin akan keluar ?', [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Keluar',
        onPress: () => {
          storeData('user', null);

          navigation.reset({
            index: 0,
            routes: [{name: 'Splash'}],
          });
        },
      },
    ]);
  };

  const MyList = ({label, value}) => {
    return (
      <View
        style={{
          marginTop: 10,
        }}>
        <Text
          style={{
            fontFamily: fonts.primary[600],
            color: colors.primary,
            marginLeft: 10,
          }}>
          {label}
        </Text>

        <View
          style={{
            marginVertical: 2,
            padding: 5,
            paddingHorizontal: 10,
            backgroundColor: colors.blueGray[50],
            borderRadius: 10,
            height: 50,
            justifyContent:'center'
          }}>
          <Text
            style={{
              fontFamily:fonts.secondary[600],
              color: colors.blueGray[900],
            }}>
            {value}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <MyHeader title="Akun Saya" onPress={() => navigation.goBack()} />
      {!open && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        {open && (
          <View
            style={{
              margin: 5,
              flex: 1,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}></View>
            <View style={{padding: 10}}>
              <MyList label="Nama Lengkap" value={user.nama_customer} />
              <MyList label="Username" value={user.username} />
              <MyList label="Email" value={user.email} />

              <MyList label="Telepon / WA" value={user.telepon_customer} />
              <MyList label="Alamat" value={user.alamat_customer} />
            </View>
            {/* data detail */}
          </View>
        )}
        <View
          style={{
            padding: 20,
          }}>
          <MyButton
            warna={colors.primary}
            title="Edit Profile"
            onPress={() => navigation.navigate('AccountEdit', user)}
          />
          <MyGap height={10} />
          <MyButton
            onPress={btnKeluar}
            backgroundColor={colors.blueGray[400]}
            title="Log Out"
            iconColor={colors.white}
            colorText={colors.white}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,backgroundColor:colors.secondary },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
