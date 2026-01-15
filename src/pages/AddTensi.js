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

export default function AddTensi({navigation, route}) {
  const [kirim, setKirim] = useState({
    tanggal: moment().format('YYYY-MM-DD'),
    nama: '',
    sistole: '',
    diastole: '',
    hasil: '',
  });

  // Fungsi untuk mengklasifikasikan tekanan darah berdasarkan standar JNC 7 dan AHA
  const klasifikasiTekananDarah = (sistole, diastole) => {
    const sys = parseInt(sistole);
    const dias = parseInt(diastole);

    // Validasi input
    if (isNaN(sys) || isNaN(dias)) {
      return {
        kategori: 'Data tidak valid',
        keterangan: 'Mohon masukkan nilai yang benar',
        warna: colors.secondary,
      };
    }

    // Klasifikasi berdasarkan standar American Heart Association (AHA)
    if (sys < 90 || dias < 60) {
      return {
        kategori: 'Hipotensi',
        keterangan: 'Tekanan darah rendah. Konsultasikan dengan dokter jika ada gejala.',
        warna: '#3B82F6', // Biru
      };
    } else if (sys < 120 && dias < 80) {
      return {
        kategori: 'Normal',
        keterangan: 'Tekanan darah Anda normal. Pertahankan gaya hidup sehat!',
        warna: '#10B981', // Hijau
      };
    } else if ((sys >= 120 && sys <= 129) && dias < 80) {
      return {
        kategori: 'Elevated (Meningkat)',
        keterangan: 'Tekanan darah mulai meningkat. Perhatikan pola makan dan olahraga teratur.',
        warna: '#F59E0B', // Kuning/Orange
      };
    } else if ((sys >= 130 && sys <= 139) || (dias >= 80 && dias <= 89)) {
      return {
        kategori: 'Hipertensi Stadium 1',
        keterangan: 'Hipertensi ringan. Konsultasi dengan dokter untuk penanganan.',
        warna: '#F97316', // Orange
      };
    } else if (sys >= 140 || dias >= 90) {
      return {
        kategori: 'Hipertensi Stadium 2',
        keterangan: 'Hipertensi tinggi. Segera konsultasi dengan dokter untuk pengobatan.',
        warna: '#EF4444', // Merah
      };
    } else if (sys > 180 || dias > 120) {
      return {
        kategori: 'Krisis Hipertensi',
        keterangan: 'DARURAT! Segera cari pertolongan medis!',
        warna: '#DC2626', // Merah Tua
      };
    }

    return {
      kategori: 'Tidak terdefinisi',
      keterangan: 'Silakan periksa kembali nilai yang dimasukkan.',
      warna: colors.secondary,
    };
  };

  // Update hasil ketika sistole atau diastole berubah
  useEffect(() => {
    if (kirim.sistole && kirim.diastole) {
      const hasil = klasifikasiTekananDarah(kirim.sistole, kirim.diastole);
      setKirim(prev => ({
        ...prev,
        hasil: hasil.kategori,
        keterangan: hasil.keterangan,
        warna: hasil.warna,
      }));
    }
  }, [kirim.sistole, kirim.diastole]);

  const insertTensi = async () => {
    try {
      // Validasi input
      if (!kirim.sistole.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Gagal',
          text2: 'Sistole harus diisi',
        });
        return;
      }

      if (!kirim.diastole.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Gagal',
          text2: 'Diastole harus diisi',
        });
        return;
      }

      const sys = parseInt(kirim.sistole);
      const dias = parseInt(kirim.diastole);

      // Validasi range tekanan darah
      if (sys < 40 || sys > 250) {
        Toast.show({
          type: 'error',
          text1: 'Nilai Tidak Valid',
          text2: 'Sistole harus antara 40-250 mmHg',
        });
        return;
      }

      if (dias < 30 || dias > 200) {
        Toast.show({
          type: 'error',
          text1: 'Nilai Tidak Valid',
          text2: 'Diastole harus antara 30-200 mmHg',
        });
        return;
      }

      if (sys <= dias) {
        Toast.show({
          type: 'error',
          text1: 'Nilai Tidak Valid',
          text2: 'Sistole harus lebih besar dari Diastole',
        });
        return;
      }

      // Hitung hasil klasifikasi
      const hasilKlasifikasi = klasifikasiTekananDarah(kirim.sistole, kirim.diastole);

      // Ambil data tensi yang sudah ada
      let oldData = await getData('tensi');
      let tensiArray = [];

      if (oldData) {
        tensiArray = Array.isArray(oldData) ? oldData : [oldData];
      }

      // Tambahkan ID unik untuk data baru
      const newTensi = {
        id: Date.now().toString(),
        tanggal: kirim.tanggal,
        sistole: kirim.sistole,
        diastole: kirim.diastole,
        hasil: hasilKlasifikasi.kategori,
        keterangan: hasilKlasifikasi.keterangan,
        warna: hasilKlasifikasi.warna,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      };

      // Tambahkan data baru ke array
      tensiArray.push(newTensi);

      // Simpan ke localStorage
      await storeData('tensi', tensiArray);

      Toast.show({
        type: 'success',
        text1: 'Berhasil',
        text2: 'Data tekanan darah berhasil disimpan',
      });

      console.log('Data tensi yang disimpan:', newTensi);

      // Kembali ke halaman sebelumnya
      setTimeout(() => {
        navigation.goBack();
      }, 1000);

    } catch (error) {
      console.error('Error saving tensi:', error);
      Toast.show({
        type: 'error',
        text1: 'Gagal',
        text2: 'Terjadi kesalahan saat menyimpan data',
      });
    }
  };

  return (
    <View style={styles.container}>
      <MyHeader title="Tambah Cek Tekanan Darah" onPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <MyCalendar 
            label="Tanggal Pemeriksaan" 
            value={kirim.tanggal} 
            onChangeText={x => setKirim({...kirim, tanggal: x})} 
          />
          
          <MyInput 
            label="Sistole (mmHg)" 
            placeholder="Contoh: 120" 
            value={kirim.sistole} 
            onChangeText={x => {
              setKirim({...kirim, sistole: x});
            }} 
            keyboardType='number-pad' 
            iconname='user-heart' 
          />

          <MyInput 
            label="Diastole (mmHg)" 
            placeholder="Contoh: 80" 
            value={kirim.diastole} 
            onChangeText={x => {
              setKirim({...kirim, diastole: x});
            }} 
            keyboardType='number-pad' 
            iconname='user-heart' 
          />

          {/* Tampilkan hasil klasifikasi jika sudah ada input */}
          {kirim.sistole && kirim.diastole && (
            <View style={[styles.hasilContainer, { backgroundColor: kirim.warna + '20' }]}>
              <View style={[styles.hasilBadge, { backgroundColor: kirim.warna }]}>
                <Text style={styles.hasilBadgeText}>{kirim.hasil}</Text>
              </View>
              <Text style={styles.hasilText}>
                {kirim.sistole}/{kirim.diastole} mmHg
              </Text>
              <Text style={styles.keteranganText}>{kirim.keterangan}</Text>
            </View>
          )}

          {/* Informasi Standar Tekanan Darah */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Standar Tekanan Darah (AHA):</Text>
            <View style={styles.infoRow}>
              <View style={[styles.infoIndicator, { backgroundColor: '#10B981' }]} />
              <Text style={styles.infoText}>Normal: {'<'}120/{'<'}80 mmHg</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.infoIndicator, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.infoText}>Elevated: 120-129/{'<'}80 mmHg</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.infoIndicator, { backgroundColor: '#F97316' }]} />
              <Text style={styles.infoText}>Hipertensi Stage 1: 130-139/80-89 mmHg</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.infoIndicator, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.infoText}>Hipertensi Stage 2: ≥140/≥90 mmHg</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.infoIndicator, { backgroundColor: '#DC2626' }]} />
              <Text style={styles.infoText}>Krisis: {'>'}180/{'>'}120 mmHg</Text>
            </View>
          </View>

          <MyButton
            title="Simpan Data Tekanan Darah"
            onPress={insertTensi}
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
  hasilContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hasilBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  hasilBadgeText: {
    fontFamily: fonts.secondary[700],
    fontSize: 14,
    color: colors.white,
  },
  hasilText: {
    fontFamily: fonts.secondary[700],
    fontSize: 24,
    color: colors.dark,
    marginBottom: 8,
  },
  keteranganText: {
    fontFamily: fonts.secondary[400],
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
  },
  infoContainer: {
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoTitle: {
    fontFamily: fonts.secondary[700],
    fontSize: 14,
    color: colors.dark,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  infoText: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    color: colors.dark,
    flex: 1,
  },
  saveButton: {
    marginTop: 20,
  },
});