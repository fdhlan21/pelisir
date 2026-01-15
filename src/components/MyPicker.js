import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Modal,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { fonts } from '../utils/fonts';
import MyIcon from './MyIcon';
import { colors } from '../utils/colors';

export default function MyPicker({
  label,
  nolabel = false,
  icon = true,
  iconname = 'server-path',
  onChangeText,
  value,
  placeholder = "Pilih data",
  colorIcon = colors.danger,
  data = []
}) {

  const [showModal, setShowModal] = useState(false);

  const isIOS = Platform.OS === "ios";

  return (
    <View>
      {!nolabel && (
        <Text style={styles.label}>{label}</Text>
      )}

      {/* INPUT UI */}

      {!isIOS &&
    //    <View  style={styles.input}>
           
              <View style={{
                height:50,
                backgroundColor:colors.white,
                borderRadius:10,
                justifyContent:'center',
                paddingLeft:40,
              }}>
                 {icon && (
                 <View style={{
                    position:'absolute',
                    left:10,
                 }}>
                    <MyIcon
                   name={iconname}
                   color={colorIcon}
                   size={24}
                   style={{ marginRight: 12 }}
                 />
                    </View>
               )}
<Picker
                selectedValue={value}
                onValueChange={(val) => {
                  onChangeText(val);
                }}
              >
                <Picker.Item label={placeholder} value="" />
                {data.map((item, index) => (
                  <Picker.Item style={{
                    fontFamily:fonts.secondary[600]
                  }} key={index} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View> 
       
      }

      {isIOS &&
       <>
        <TouchableOpacity
        activeOpacity={0.8}
        style={styles.input}
        onPress={() => {
          if (isIOS) setShowModal(true);
        }}
      >
         {icon && (
                 <MyIcon
                   name={iconname}
                   color={colorIcon}
                   size={24}
                   style={{ marginRight: 12 }}
                 />
               )}

        <Text style={{
        paddingLeft:10,
          fontFamily: fonts.secondary[600],
          color: value ? colors.black : colors.blueGray[400]
        }}>
          {value ? items.find(x => x.value === value)?.label : placeholder}
        </Text>
      </TouchableOpacity>


   <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              
              <View style={{ padding: 10 }}>
                <Text style={{ fontFamily: fonts.secondary[700], fontSize: 16 }}>
                  Pilih {label}
                </Text>
              </View>

              <Picker
                selectedValue={value}
                onValueChange={(val) => {
                  onChangeText(val);
                }}
              >
                <Picker.Item label={placeholder} value="" />
                {items.map((item, index) => (
                  <Picker.Item key={index} label={item.label} value={item.value} />
                ))}
              </Picker>

              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeBtn}
              >
                <Text style={styles.closeText}>Selesai</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
       </>
      }


    

    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.secondary[700],
    color: colors.black,
    marginBottom: 8,
  },

  input: {
    height: 50,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  /* ANDROID: dropdown langsung */
  androidPicker: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 10,
  },

  /* iOS modal style */
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000060',
  },

  modalBox: {
    backgroundColor: '#fff',
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  closeBtn: {
    backgroundColor: colors.danger,
    padding: 12,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  closeText: {
    color: '#fff',
    fontFamily: fonts.secondary[700],
  }
});
