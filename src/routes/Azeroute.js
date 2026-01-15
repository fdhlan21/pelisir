import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Spalsh from '../pages/Spalsh';
import Login from '../pages/Login';
import Home from '../pages/Home';
import MPosition from '../pages/Mposition';
import Maintabs from './Maintabs';
import MpositionDetail from '../pages/MpositionDetail';
import Search from '../pages/Search';
import Proses from '../pages/Proses';
import Result from '../pages/Result';
import SearchPlat from '../pages/SearchPlat';
import SearchCP from '../pages/SearchCP';
import AIloday from '../pages/AIloday';
import Transaksi from '../pages/Transaksi';
import TransaksiDetail from '../pages/TransaksiDetail';
import Register from '../pages/Register';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import AccoountEdit from '../pages/AccoountEdit';
import Artikel from '../pages/Artikel';
import ArtikelDetail from '../pages/ArtikelDetail';
import ProdukDetail from '../pages/ProdukDetail';
import CheckOut from '../pages/CheckOut';
import Akses from '../pages/Akses';
import BukuBundling from '../pages/BukuBundling';
import BukuKolaborasi from '../pages/BukuKolaborasi';
import BukuMandiri from '../pages/BukuMandiri';
import AddObat from '../pages/AddObat';
import AddTensi from '../pages/AddTensi';

const Stack = createNativeStackNavigator();

export default function Azeroute() {

  const optionHeder  = {
                
                  headerStyle:{
                    backgroundColor:colors.primary,
                  },
                  headerTitleStyle:{
                    color:colors.white,
                    fontFamily:fonts.secondary[700],
                    fontSize:16,
                    
                  },
                  headerTitleAlign:'center',
                  headerTintColor: '#fff',        // warna icon & text
                }
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen name="Splash" options={{
          headerShown:false
        }} component={Spalsh} />
           <Stack.Screen name="AddObat" options={{
          headerShown:false
        }} component={AddObat} />

          <Stack.Screen name="AddTensi" options={{
          headerShown:false
        }} component={AddTensi} />


        <Stack.Screen name="Login" options={{
          headerShown:false
        }}  component={Login} />
        <Stack.Screen name="MPosition" component={MPosition} />
        <Stack.Screen name="MpositionDetail" component={MpositionDetail} />

        {/* NEW */}
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="SearchCP" component={SearchCP} />
        <Stack.Screen name="SearchPlat" component={SearchPlat} />
                <Stack.Screen name="Proses" component={Proses} />
                <Stack.Screen name="Result" component={Result} />
                <Stack.Screen name="AIloday" component={AIloday} />
                <Stack.Screen name="Transaksi" component={Transaksi} />
                <Stack.Screen name="TransaksiDetail" options={{
                  ...optionHeder,
                  title:'Transaksi Detail'
                }}  component={TransaksiDetail} />
        <Stack.Screen name="Register" options={optionHeder} component={Register} />
        <Stack.Screen name="ProdukDetail" options={{
          headerShown:false
        }}component={ProdukDetail} />


          <Stack.Screen name="Artikel" options={{
          headerShown:false
        }}  component={Artikel} />

          <Stack.Screen name="ArtikelDetail" options={{
          headerShown:false
        }}  component={ArtikelDetail} />

                 <Stack.Screen name="CheckOut" options={{
          headerShown:false
        }}  component={CheckOut} />

            <Stack.Screen name="Akses" options={{
          headerShown:false
        }}  component={Akses} />

         <Stack.Screen name="BukuBundling" options={{
          headerShown:false
        }}  component={BukuBundling} />
         <Stack.Screen name="BukuKolaborasi" options={{
          headerShown:false
        }}  component={BukuKolaborasi} />
         <Stack.Screen name="BukuMandiri" options={{
          headerShown:false
        }}  component={BukuMandiri} />

        <Stack.Screen name="Home" options={{
          headerShown:false
        }} component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
