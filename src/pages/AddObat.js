import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import { colors } from '../utils/colors';
import { fonts, windowWidth } from '../utils/fonts';
import Toast from 'react-native-toast-message';
import { apiURL, getData, storeData, webURL } from '../utils/localStorage';
import MyHeader from '../components/MyHeader';
import MyButton from '../components/MyButton';
import MyInput from '../components/MyInput';
import MyCalendar from '../components/MyCalendar';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddObat({navigation, route}) {
  const [paymentProof, setPaymentProof] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);

  const [kirim, setKirim] = useState({
    foto: null,
    tanggal_mulai: moment().format('YYYY-MM-DD'),
    tanggal_berakhir: moment().format('YYYY-MM-DD'),
    nama: '',
    dosis: '',
    frekuensi: 1,
    waktu: ['08:00'],
    catatan: '',
  });

  // Update waktu array ketika frekuensi berubah
  useEffect(() => {
    const freq = parseInt(kirim.frekuensi) || 1;
    const currentWaktu = [...kirim.waktu];
    
    if (freq > currentWaktu.length) {
      // Tambah waktu default jika frekuensi bertambah
      const newTimes = Array.from({ length: freq - currentWaktu.length }, () => '08:00');
      setKirim({...kirim, waktu: [...currentWaktu, ...newTimes]});
    } else if (freq < currentWaktu.length) {
      // Kurangi waktu jika frekuensi berkurang
      setKirim({...kirim, waktu: currentWaktu.slice(0, freq)});
    }
  }, [kirim.frekuensi]);

  const onTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (event.type === 'set' && selectedTime) {
      const timeString = moment(selectedTime).format('HH:mm');
      const newWaktu = [...kirim.waktu];
      newWaktu[selectedTimeIndex] = timeString;
      setKirim({...kirim, waktu: newWaktu});
    }

    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
  };

  const openTimePicker = (index) => {
    setSelectedTimeIndex(index);
    setShowTimePicker(true);
  };

  const selectImageSource = () => {
    Alert.alert('Upload Foto Obat', 'Pilih sumber gambar', [
      
      {text: 'Gallery', onPress: () => handleImageSelection('library')},
      {text: 'Batal', style: 'cancel'},
    ]);
  };

  const handleImageSelection = source => {
    const imagePicker = source === 'camera' ? launchCamera : launchImageLibrary;

    imagePicker(
      {
        includeBase64: true,
        mediaType: 'photo',
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets) {
          const fotoBase64 = `data:${response.assets[0].type};base64,${response.assets[0].base64}`;
          setKirim({...kirim, foto: fotoBase64});
          setPaymentProof(fotoBase64);
        }
      },
    );
  };

  const insertObat = async () => {
    try {
      // Validasi input
      if (!kirim.nama.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Gagal',
          text2: 'Nama obat harus diisi',
        });
        return;
      }

      if (!kirim.dosis.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Gagal',
          text2: 'Dosis obat harus diisi',
        });
        return;
      }

      // Ambil data obat yang sudah ada
      let oldData = await getData('obat');
      let obatArray = [];

      if (oldData) {
        // Jika oldData adalah array, gunakan langsung
        // Jika bukan, buat array baru dengan oldData sebagai elemen pertama
        obatArray = Array.isArray(oldData) ? oldData : [oldData];
      }

      // Tambahkan ID unik untuk obat baru
      const newObat = {
        ...kirim,
        id: Date.now().toString(), // ID unik berdasarkan timestamp
        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      };

      // Tambahkan obat baru ke array
      obatArray.push(newObat);

      // Simpan ke localStorage
      await storeData('obat', obatArray);

      Toast.show({
        type: 'success',
        text1: 'Berhasil',
        text2: 'Data obat berhasil disimpan',
      });

      console.log('Data obat yang disimpan:', newObat);

      // Kembali ke halaman sebelumnya
      setTimeout(() => {
        navigation.goBack();
      }, 1000);

    } catch (error) {
      console.error('Error saving obat:', error);
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Terjadi kesalahan saat menyimpan data',
      });
    }
  };

  return (
    <View style={styles.container}>
      <MyHeader title="Tambah Obat" onPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Image 
            source={kirim.foto == null ? require('../assets/kosong.png') : {uri: kirim.foto}} 
            style={styles.foto} 
          />
          <MyButton
            title="Upload Foto Obat"
            type="outline"
            onPress={selectImageSource}
            style={styles.changeProofButton}
          />

          <MyInput 
            label="Nama Obat" 
            value={kirim.nama} 
            onChangeText={x => setKirim({...kirim, nama: x})} 
            placeholder="Masukan nama obat" 
            iconname='pill' 
          />
          
          <MyInput 
            label="Dosis" 
            value={kirim.dosis} 
            onChangeText={x => setKirim({...kirim, dosis: x})} 
            placeholder="Masukan Dosis (contoh: 500mg)" 
            iconname='pill' 
          />
          
          <MyCalendar 
            label="Tanggal Mulai" 
            value={kirim.tanggal_mulai} 
            onChangeText={x => setKirim({...kirim, tanggal_mulai: x})} 
          />
          
          <MyCalendar 
            label="Tanggal Berakhir" 
            value={kirim.tanggal_berakhir} 
            onChangeText={x => setKirim({...kirim, tanggal_berakhir: x})} 
          />
    
          <MyInput 
            label="Frekuensi / hari" 
            placeholder="Masukan frekuensi" 
            value={kirim.frekuensi.toString()} 
            onChangeText={x => {
            //   const num = parseInt(x) || 1;
              setKirim({...kirim, frekuensi: x});
            }} 
            keyboardType='number-pad' 
            iconname='pill' 
          />

          {/* Time Picker untuk setiap frekuensi */}
          {kirim.waktu.map((time, index) => (
            <View key={index} style={styles.timePickerContainer}>
              <Text style={styles.timeLabel}>Jam {index + 1}</Text>
              <TouchableOpacity 
                style={styles.timeInput}
                onPress={() => openTimePicker(index)}
              >
                <Text style={styles.timeText}>{time}</Text>
              </TouchableOpacity>
            </View>
          ))}

          {showTimePicker && (
            <DateTimePicker
              value={moment(kirim.waktu[selectedTimeIndex], 'HH:mm').toDate()}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
            />
          )}
          
          <MyInput 
            label="Catatan" 
            placeholder="Masukan catatan (opsional)" 
            value={kirim.catatan} 
            onChangeText={x => setKirim({...kirim, catatan: x})} 
            iconname='pill'
            multiline={true}
            numberOfLines={4}
          />

          <MyButton
            title="Simpan Obat"
            onPress={insertObat}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  foto: {
    width: windowWidth / 1.5,
    height: windowWidth / 1.5,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 15,
    borderRadius: 10,
  },
  changeProofButton: {
    marginBottom: 20,
  },
  timePickerContainer: {
    marginBottom: 15,
  },
  timeLabel: {
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    color: colors.dark,
    marginBottom: 8,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 15,
    backgroundColor: colors.white,
  },
  timeText: {
    fontFamily: fonts.secondary[600],
    fontSize: 16,
    color: colors.primary,
  },
  saveButton: {
    marginTop: 20,
  },
});