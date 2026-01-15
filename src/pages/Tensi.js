import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../utils/colors';
import DeviceInfo from 'react-native-device-info';
import { fonts, windowWidth } from '../utils/fonts';
import { apiURL, getData, LODAY_HEADER, MYAPP, storeData, webURL } from '../utils/localStorage';
import axios from 'axios';
import MyIcon from '../components/MyIcon';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/id';
import MyButton from '../components/MyButton';
import dayjs from 'dayjs';

const { width, height } = Dimensions.get('window');

export default function Tensi({navigation}) {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);

  const navigateToDetail = product => {
    navigation.navigate('ProdukDetail', {product});
  };

  const getAlarm = () => {
      getData('tensi').then(res=>{
        console.log(res);
        setData(res)
      })
  };


  const deleteData = (id)=>{

   const tmp = data.filter(i => i.id !== id);

  console.log(tmp);
  storeData('tensi', tmp);
  setData(tmp);

  }

  const [timer,setTime]  = useState(dayjs().format('HH:mm:ss'))

useEffect(() => {
  const timer = setInterval(() => {
    setTime(dayjs().format('HH:mm:ss'));
  }, 1000);

  return () => clearInterval(timer);
}, []);


  const isFocused = useIsFocused();
  useEffect(() => {


    if (isFocused) {
      getAlarm();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.header}>
            <Image
        
        source={require('../assets/logo.png')}
        style={{
          resizeMode:'contain',
          alignSelf: 'center',
          width: 60,
          height: 60,
        }}
      />
            <View style={{
              paddingLeft:10,
            }}>
              <Text style={{
                fontFamily:fonts.secondary[800],
                fontSize:30,
                lineHeight:25,
              }}>AMIO</Text>
              <Text style={{
                fontFamily:fonts.secondary[600],
                fontSize:9,
              }}>Alarm Minum Obat</Text>
            </View>
        </View>
      </View>
     <View style={{
      flex:1,
      paddingHorizontal:20,
      paddingVertical:10,
     }}>
      <Text style={{
        fontFamily:fonts.secondary[600],
        fontSize:16
      }}>Riwayat Cek Tekanan Darah</Text>
     
     
          
        <FlatList data={data} renderItem={({item,index})=>{
          return (
            <View style={{
              padding:10,
              borderWidth:1,
              marginVertical:10,
              borderColor:colors.blueGray[300],
              borderRadius:10,
              flexDirection:'row',
              
            }}>
             <View style={{
              flex:1,
              paddingRight:5,
             }}>
               <Text style={{
                fontFamily:fonts.secondary[800],
                color:colors.primary,
                fontSize:14
              }}>{moment(item.tanggal).format('DD MMMM YYYY')}</Text>
            
              <Text style={{
                fontFamily:fonts.secondary[600],
                color:colors.secondary,
                fontSize:12
              }}>Sistole : {item.sistole} mmHg</Text>
              <Text style={{
                fontFamily:fonts.secondary[600],
                color:colors.black,
                fontSize:12
              }}>Diastole : {item.diastole} mmHg</Text>

            <Text style={{
                fontFamily:fonts.secondary[800],
                color:item.warna,
                fontSize:15
              }}>{item.hasil}</Text>
              
              <Text style={{
                fontFamily:fonts.secondary[400],
                color:colors.black,
                fontSize:10
              }}>{item.keterangan}</Text>
             </View>
             <View style={{
                width:80,
                justifyContent:'flex-end'
             }}>
            
              <MyButton backgroundColor={colors.danger} title="Hapus" onPress={()=>{
                Alert.alert(MYAPP,'Kamu yakin akan hapus ini ?',[
                  {
                    text:'TIDAK'
                  },
                  {
                    text:'YA, HAPUS',
                    onPress:()=>{
                      deleteData(item.id)
                    }
                  }
                ])
              }} />
             </View>
             
            </View>
          )
        }} />
          

      <MyButton onPress={()=>navigation.navigate('AddTensi')} title="Tambah Cek Tekanan Darah" />
     </View>
     
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    backgroundColor: colors.background,
    // borderBottomLeftRadius: 30,
    // borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical:10,

  },
  logo: {
    width: 100,
    height: 50,
    borderRadius: 10,
  },
  greetingText: {
    fontFamily: fonts.secondary[600],
    fontSize: 13,
    color: colors.white,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: fonts.secondary[700],
    fontSize: 20,
    color: colors.primary,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontFamily: fonts.secondary[400],
    fontSize: 14,
    color: '#666',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  productCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    minHeight: 280,
  },
 
});
