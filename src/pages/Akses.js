import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon} from 'react-native-elements';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import MyIcon from '../components/MyIcon';

export default function Akses({navigation, route}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <View
        style={{
          padding: 10,
        }}>
        <Text
          style={{
            fontFamily: fonts.secondary[800],
            fontSize: 14,
            marginBottom: 10,
          }}>
          Benefit Publikasi
        </Text>
        <Text style={styles.benefitText}>1. Buku Ber-ISBN </Text>
        <Text style={styles.benefitText}>2. Cover premium </Text>
        <Text style={styles.benefitText}>3. Layout dan Editing Naskah</Text>
        <Text style={styles.benefitText}>4. Buku Cetak 5 Eksemplar </Text>
        <Text style={styles.benefitText}>5. Royalti 100% untuk author </Text>
        <Text style={styles.benefitText}>6. Dummy (soft copy buku) </Text>
        <Text style={styles.benefitText}>7. Sertifikat publish </Text>
        <Text style={styles.benefitText}>
          8. G⁠ratis ongkir seluruh Indonesia
        </Text>
        <Text style={styles.benefitText}>
          *Khusus P1 Kolaborasi mendapatkan hard copy
        </Text>
      </View>
      <View
        style={{
          padding: 10,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('BukuKolaborasi')}
          style={styles.btnakses}>
          <Text style={styles.textakses}>
            Kolaborasi Buku Eksklusif (Hanya 5 Penulis)
          </Text>
          <MyIcon
            type="ionicon"
            name="chevron-forward-circle"
            color={colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('BukuBundling')}
          style={styles.btnakses}>
          <Text style={styles.textakses}>Paket Bundling (Naskah + Terbit)</Text>
          <MyIcon
            type="ionicon"
            name="chevron-forward-circle"
            color={colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('BukuMandiri')}
          style={styles.btnakses}>
          <Text style={styles.textakses}>Paket Mandiri/Tunggal</Text>
          <MyIcon
            type="ionicon"
            name="chevron-forward-circle"
            color={colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  benefitText: {
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    marginVertical: 3,
  },
  btnakses: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textakses: {
    flex: 1,
    fontFamily: fonts.secondary[600],
    color: colors.white,
    fontSize: 11,
  },
});
