import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Modal,
  Button
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { fonts } from '../utils/fonts';
import MyIcon from './MyIcon';
import { colors } from '../utils/colors';
import moment from 'moment';

export default function MyCalendar({
  label,
  nolabel = false,
  icon = true,
  iconname = 'calendar',
  onChangeText,
  value,
  placeholder = "Pilih tanggal",
  colorIcon = colors.primary,
}) {

  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date());

  const onChange = (event, selectedDate) => {


    if (Platform.OS === "android") {
      // langsung close & update untuk ANDROID
      setShowPicker(false);
      if (selectedDate) {
        onChangeText(selectedDate);
      }
    } else {
      // iOS tidak close, simpan ke temp
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const iosConfirm = () => {
    setShowPicker(false);
    onChangeText(tempDate);
  };

  return (
    <View style={{
      marginVertical:10,
    }}>
      {!nolabel && (
        <Text style={{
          fontFamily: fonts.secondary[600],
          color: colors.primary,
          marginBottom: 8,
        }}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        activeOpacity={0.8}
        style={styles.input}
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
          color: value ? colors.black : colors.blueGray[400],
        }}>
          {value ? moment(value).format('DD MMMM YYYY') : placeholder}
        </Text>
      </TouchableOpacity>

      {/* ANDROID Popup */}
      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

      {/* iOS Modal */}
      {Platform.OS === "ios" && (
        <Modal visible={showPicker} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>

              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={onChange}
                style={{ width: '100%' }}
              />

              <View style={styles.btnWrapper}>
                
                <Button title="Batal" onPress={() => setShowPicker(false)} />
                    <Button title="Selesai" onPress={iosConfirm} />
              </View>

            </View>
          </View>
        </Modal>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    backgroundColor: colors.blueGray[200],
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000060',
  },

  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  }
});
