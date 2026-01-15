import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { fonts, windowWidth } from '../utils/fonts';
import { colors } from '../utils/colors';
import { useNavigation } from '@react-navigation/native';
import MyIcon from './MyIcon';

export default function MyHeader({title="",back=true}) {

    const navigation = useNavigation();
  return (
     <View style={styles.header}>
            {back && 
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btn}>
                <MyIcon name='arrow-left' size={30} color={colors.primary} />
              </TouchableOpacity>
            }
            <Text style={styles.title}>{title}</Text>
            {/* <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
            /> */}
          </View>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  btn:{
    marginRight:10,
    paddingRight:10,
  },

  header: {
    height:50,  
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  title: {
    flex: 1,
    fontFamily: fonts.secondary[700],
    fontSize: 16,
    color: colors.black,
  },

  logo: {
    width: windowWidth / 3,
    height: windowWidth / 6,
    resizeMode:'contain'
  },

});