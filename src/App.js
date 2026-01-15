/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Azeroute from './routes/Azeroute';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { fonts } from './utils/fonts';
import { colors } from './utils/colors';
import MyIcon from './components/MyIcon';


function App() {

  const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: colors.primary,backgroundColor:colors.white }}
         renderLeadingIcon={()=>{
          return (
            <View style={{
              justifyContent:'center',
              alignItems:'center',
            }}>
              <MyIcon name='check-circle' size={50} color={colors.primary} />
            </View>
          )
         }}
         renderTrailingIcon={()=>{
          return (
             <View style={{
              justifyContent:'center',
              alignItems:'center'
             }}>
              <Image source={require('./assets/logo.png')} style={{
        width:50,
        height:30,
        resizeMode:'contain'
      }}/>
             </View>
          )
         }}
      text1Style={{
          fontSize: 14,
          color:colors.black,
        fontFamily:fonts.primary[800]
      }}
      text2Style={{
        fontSize: 12,
        color:colors.black,
        fontFamily:fonts.primary[400]
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
         style={{ borderLeftColor: colors.danger,backgroundColor:'#FFFFFF' }}
         renderLeadingIcon={()=>{
          return (
            <View style={{
              justifyContent:'center',
              alignItems:'center',
            }}>
              <MyIcon name='close-circle' size={50} color={colors.danger} />
            </View>
          )
         }}
         renderTrailingIcon={()=>{
          return (
          <View style={{
              justifyContent:'center',
              alignItems:'center'
             }}>
              <Image source={require('./assets/logo.png')} style={{
        width:50,
        height:30,
        resizeMode:'contain'
      }}/>
             </View>
          )
         }}
      text1Style={{
          fontSize: 14,
          color:colors.black,
        fontFamily:fonts.primary[800]
      }}
      text2Style={{
        fontSize: 12,
               color:colors.black,
        fontFamily:fonts.primary[400]
      }}
    />
  ),

   azeError: ({ text1,props }) => (
    <View style={{ height: 60, width: '90%', backgroundColor: '#00000080',borderRadius:15,flexDirection:'row'}}>
     
      <View style={{
        flex:1,
      }}>
        <Text>{text1}</Text>
      <Text>{props.message}</Text>
      </View>
       <View>
      <Image source={require('./assets/nagaputih.png')} style={{
        width:50,
        height:50,
      }}/>
      </View>
    </View>
  )

};


  return (
    <SafeAreaProvider>
      
      
      <Azeroute />
       <Toast
       config={toastConfig}
        position='bottom'
        duration={2000}
        bottomOffset={100}
        animationDuration={250}
        anu="zoom-in"
      />
    </SafeAreaProvider>
  );
}

export default App;
