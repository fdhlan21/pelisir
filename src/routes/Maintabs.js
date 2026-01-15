import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Home from '../pages/Home';
import Account from '../pages/Account';
import { colors } from '../utils/colors';
import MyIcon from '../components/MyIcon';
import AIloday from '../pages/AIloday';
import Transaksi from '../pages/Transaksi';
import Telegram from '../pages/Telegram';
import Artikel from '../pages/Artikel';
import Akses from '../pages/Akses';
import Tensi from '../pages/Tensi';

const Tab = createBottomTabNavigator();

export default function Maintabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          paddingTop:10,
          height: 70,
          
          
        },
      }}
    >
      {/* Tab kiri */}
      <Tab.Screen
        name="Beranda"
        component={Home}
        options={{
          headerShown:false,
          tabBarIcon: ({ focused }) => (

            <MyIcon name='home-smile' size={30} color={focused ? colors.primary : colors.secondary} />
           
          ),
        }}
      />

   


      
      {/* <Tab.Screen
        name="Bot"
        component={Telegram}
        options={{
          tabBarIcon: ({ focused }) => (
            <MyIcon name='chat' size={30} color={focused ? colors.danger : colors.black} />
          ),
        }}
      />   */}

      {/* Tombol Tengah */}
      {/* <Tab.Screen
        name="CenterButton"
        component={AIloday} // Bisa diarahkan ke halaman lain
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerButton}>
              <Image
                source={require('../assets/home.png')} // Ganti dengan icon kamu
                style={{ width: 40, height: 40, tintColor: colors.white,resizeMode:'contain' }}
              />
            </View>
          ),
          
        }}
      /> */}
 <Tab.Screen
        name="Riwayat"
        component={Transaksi}
        options={{
          tabBarIcon: ({ focused }) => (
            <MyIcon name='billlist' size={30} color={focused ? colors.primary : colors.secondary} />
          ),
        }}
      />

          <Tab.Screen
        name="Tensi"
        component={Tensi}
        options={{
          tabBarIcon: ({ focused }) => (

            <MyIcon name='stethoscope' size={30} color={focused ? colors.primary : colors.secondary} />
           
          ),
        }}
      />
  
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    width: 65,
    height: 65,
    backgroundColor: colors.danger,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    top: -10, // naikkan sedikit ke atas bar
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // elevation: 6,
  },
});
