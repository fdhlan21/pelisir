import React, { useState,useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Alert,
  
} from 'react-native';

import { colors } from '../utils/colors';
import { WebView } from 'react-native-webview';
import { fonts } from '../utils/fonts';
import MyButton from '../components/MyButton';
import MyGap from '../components/MyGap';
import { getData, LODAY_HEADER } from '../utils/localStorage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { generatePDF } from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Share as ShareNative } from 'react-native';
import ViewShot from "react-native-view-shot";
import { useEffect } from 'react';

export default function MpositionDetail({ navigation, route }) {
  const item = route.params.item[0];
  const input = route.params.input;
    const ref = useRef();

  const [loading, setLoading] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);

  console.log(item);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <style>
          #map { height: 100vh; width: 100%; }
          body { margin: 0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${item.maps.toString().split('?q=')[1].split(',')[0]}, ${item.maps.toString().split('?q=')[1].split(',')[1]}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);
          L.marker([${item.maps.toString().split('?q=')[1].split(',')[0]}, ${item.maps.toString().split('?q=')[1].split(',')[1]}]).addTo(map)
            .bindPopup('Lokasi: ${item.maps.toString().split('?q=')[1].split(',')[0]}, ${item.maps.toString().split('?q=')[1].split(',')[1]}')
            .openPopup();
        </script>
      </body>
    </html>
  `;

  const saveResult = async () => {
    try {
      const user = await getData('user');

      const data = {
        method: 'CP',
        input: input,
        fid_pengguna: user.id,
        lodaya: item,
      };

      console.log('🟢 Data yang dikirim:', data);

      setLoading(true);

      const response = await axios.post(
        `${process.env.API_URL_LOCAL}/logz`,
        data,
        LODAY_HEADER()
      );

      console.log('🟢 Respons server:', response.data);

      if (response.data?.ok) {
        Toast.show({
          type: 'success',
          text1: 'Loday4 message',
          text2: '✅ Result berhasil disimpan!',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Loday4 message',
          text2: '⚠️ Server mengembalikan respons tidak valid.',
        });
      }
    } catch (error) {
      console.log('❌ Error saat POST:', error);

      let message = 'Tidak ada respons dari server.';

      if (error.response) {
        console.log('🔴 Error Response Data:', error.response.data);
        console.log('🔴 Error Response Status:', error.response.status);
        console.log('🔴 Error Response Headers:', error.response.headers);

        message = `Server error (${error.response.status}): ${
          error.response.data?.message || 'Terjadi kesalahan di server.'
        }`;
      } else if (error.request) {
        console.log('🔴 Tidak ada respons dari server:', error.request);
        message = 'Server tidak merespons, mungkin offline atau CORS error.';
      } else {
        console.log('🔴 Axios Error Message:', error.message);
        message = `Kesalahan konfigurasi: ${error.message}`;
      }

      Toast.show({
        type: 'error',
        text1: 'Loday4 message',
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk convert logo ke base64
  const getLogoBase64 = async () => {
    try {
      // Path ke logo di assets
      const logoPath = Image.resolveAssetSource(require('../assets/logo.png')).uri;
      
      // Baca file sebagai base64
      const base64 = await RNFS.readFile(logoPath, 'base64');
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.log('Error reading logo:', error);
      return '';
    }
  };


  // Format field name untuk ditampilkan (capitalize dan replace underscore)
  const formatFieldName = (key) => {
    const isAllCaps = /^[A-Z0-9_]+$/.test(key); // cek ALL CAPS

  if (isAllCaps) {
    return key.replace(/_/g, " ").trim(); // NIK, NO_KK → NO KK
  }

  return key
    .replace(/_/g, " ")                // underscore → spasi
    .replace(/([A-Z])/g, " $1")        // camelCase → pisah
    .replace(/\s+/g, " ")              // rapikan spasi
    .trim()
    .toLowerCase()                     // buat kecil semua dulu
    .replace(/\b\w/g, (c) => c.toUpperCase()); // kapital awal kata
  };


function formatKey(key) {
  const isAllCaps = /^[A-Z0-9_]+$/.test(key); // cek ALL CAPS

  if (isAllCaps) {
    return key.replace(/_/g, " ").trim(); // NIK, NO_KK → NO KK
  }

  return key
    .replace(/_/g, " ")                // underscore → spasi
    .replace(/([A-Z])/g, " $1")        // camelCase → pisah
    .replace(/\s+/g, " ")              // rapikan spasi
    .trim()
    .toLowerCase()                     // buat kecil semua dulu
    .replace(/\b\w/g, (c) => c.toUpperCase()); // kapital awal kata
}


    const renderDataRecord = (record, index, itemId) => {
     
      const entries = Object.entries(record);
      const displayEntries = entries
  
      return (
        <View key={index} style={styles.recordContainer}>
          {/* <Text style={styles.recordTitle}>Data #{index + 1}</Text> */}
          
          {displayEntries.map(([key, value]) => (
            <View key={key} style={styles.row}>
              <Text style={styles.label}>{formatFieldName(key)}</Text>
              <Text style={styles.value}>
                {value !== null && value !== undefined ? String(value) : '-'}
              </Text>
            </View>
          ))}
  
        </View>
      );
    };


  function renderJSONDataHTML(data, level = 0) {
  let html = "";
  const indent = level * 20; // indent nested row

  if (typeof data === "object" && data !== null) {
    for (const [key, value] of Object.entries(data)) {

      const formattedKey = formatKey(key);

      if (typeof value === "object" && value !== null) {
        // Row untuk object utama
        html += `
          <tr>
            <td style="
              padding: 8px;
              border: 1px solid #ccc;
              background: #f5f7fa;
              font-weight: bold;
              padding-left: ${indent}px;
            ">
              ${formattedKey}
            </td>
            <td style="
              padding: 8px;
              border: 1px solid #ccc;
              color: #666;
              font-style: italic;
            ">
              (Detail)
            </td>
          </tr>
        `;

        // Render isi object
        html += renderJSONDataHTML(value, level + 1);

      } else {
        // Row untuk value biasa
        html += `<tr>
            <td style="
              padding: 8px;
              border: 1px solid #ccc;
              font-weight: bold;
              background: #fafafa;
              padding-left: ${indent}px;
            ">
              ${formattedKey}
            </td>
            <td style="
              padding: 8px;
              border: 1px solid #ccc;
              color: #333;
            ">
              ${String(value)}
            </td>
          </tr>`;
      }
    }
  }

  return html;
}


 const parseLodayaData = (lodayaString) => {
    try {
      if (typeof lodayaString === 'string') {
        return JSON.parse(lodayaString);
      }
      return lodayaString;
    } catch (error) {
      console.error('Error parsing lodaya JSON:', error);
      return lodayaString; // Kembalikan string asli jika parsing gagal
    }
  };

  // Fungsi untuk generate HTML dengan watermark
  const generatePDFHTML = async (mapsImage) => {
    const  imageURL= 'https://azeraf.id/logo.png';

  const logoBase64 = "data:image/png;base64,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ASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAL/UgI8e27+ocl8BofEi2f/S0n9kx7bI3L69F69fnke6UpsUtKVvkmxffvGXknqG5vEjv3Sa3rkm+X1QnxwVkP+SQT+dc/iefHYtx99dC0tSt9KOSD87l3/u3fv4k958u3ZpOSDuUOWfDZnzuLUPa/++AurAOWJ59zR/Ms/0ps6QYD/fMoH5vTRRx98JKYTJ45ca9GiRV7TPLzkBWdmuroOMAR19c7w9vYODx9bkLB30uz3jn1+asvmFWNis5fNi/xDwpPg64S0SwvJ9506sO+vU6f2nfoC0q1bEyasXNnxzsVXXvl01MbVo0++98GJtiVNMrx3ewcFBwfnnb/W9HwDY55Wr2/vvTvUO6rH7EU3R57cmHpo4ZhfAot8YBpIJNTya7/8mX7m3PHijiTaahKJh8eb14uKPD0DIiOnL8tOGnj0x0/35ecumn3a9264b7h/UGO7xkY7rb5+ZnCeNi9YH5SWkdH29IGIfVe7d+x73fzI1OnXftHfU0IYaqKpXtZbe7Dv+Ten/75q2I5TOTcjDiT0aRLVNQjq36SQ2uXZGV20UkVo+F3fnhmXc3NevRXbK9ATGdyTK32sUwRYHeChAHhOwkvcPQPnTR2+Y8uofTNGXm67e7e3wVVpcnFxkWq0jfOkrsEG7yYl3+5b/Wr3W93YQ+IaSnWaQFnTZ5ZbUed52bFjdmy5/V5Cj93h/qFdtS4mKRL7o81rMTbhQP6SFcsifXixq6/Tj02FLyPAhmullaDbndQl/db9ltFVa2xgNGmUIUqpU9Omma3utvnh3OhXrwT05yVlp5ZdTX/rMAGzxQYjoNvzL6yYM/HmpCNdu+oVgpOT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u95e8PY3lXYNrWPlf+rFZQO81kcXf3ttaRc4cEd0cZ1868FB0k+9NDVyA16yZtOXZ/9ZM2o1AqZqJjyfdHHy2BQo+RFdGlweXvXLuviJJ83+GGLjec+j/VotbffsiKUHM07Vun79MZ6ATvkLBBArf3VSixQM2w+mjaoUjvoXsqJL6gwBXuLR9/YUdZcRXZZe2/hHrRu61RmOda2gnOfRb9tjVnZp2jvXSep1TXp/tbwYwq3OWPrMMwdbLXnMQfFfvRNdV3sIIBDjzrfYyubgtVG10Sdbe0D9w0rC9T2md+zQ7trif9hz0eM8hADPX9+TdjDlIDaVpPTvIcBd33MiZenBa+m1PoDu3yOTp/+knPudb43tDn47kEz4pw+71twBW3S/h1m38o13a03BqCBPlUDsYccuYbdJwT9VyLUtcz72PfWIzB9Jwdc2wTzV8vBJk1Wdbj5PUn+qlGtb5lzS+E4N9rSmmKPaJpinWh4uNkL7Qd+negvKvNYR4K9MDjlGk+u1Ti5PuUBHP9IfpV79KUOuZdnzb17ss8+89VMtKxkV5+kR4N7cc+6x15U8vWJQzn8rAc7z2Cmy3/9W5LXhZss+zyap1wZB/J1l4Kebtyb6O+9J9/qfEyDz/X8uAioAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEi8PgE/j/7RkRK7Obd7wAAAABJRU5ErkJggg==";


    const lat = item.maps.toString().split('?q=')[1].split(',')[0];
    const lng = item.maps.toString().split('?q=')[1].split(',')[1];
    const currentDate = new Date().toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

      const lodayaContent = renderJSONDataHTML(parseLodayaData(item));






   return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      /* Watermark pattern untuk setiap halaman */
      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.1;
        background-image: 
          url('${logoBase64}'),
          url('${logoBase64}'),
          url('${logoBase64}'),
          url('${logoBase64}'),
      
        background-size: 200px 200px;
        background-position: 
          10% 15%,
          50% 15%,
          90% 15%,
          10% 50%,
       
        background-repeat: no-repeat;
        transform: rotate(-45deg);
        pointer-events: none;
      }
      
      @media print {
        body::before {
          opacity: 0.08;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; position: relative; color: #000;">
    
    <!-- Watermark Container -->
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99; pointer-events: none;">
      <img src="${logoBase64}" style="position: absolute; top: 10%; left: 10%; transform: rotate(-45deg); opacity: 0.08; width: 200px; height: auto;" alt="Watermark">
      <img src="${logoBase64}" style="position: absolute; top: 10%; left: 50%; transform: translateX(-50%) rotate(-45deg); opacity: 0.08; width: 200px; height: auto;" alt="Watermark">
      <img src="${logoBase64}" style="position: absolute; top: 10%; right: 10%; transform: rotate(-45deg); opacity: 0.08; width: 200px; height: auto;" alt="Watermark">
      
      <img src="${logoBase64}" style="position: absolute; top: 35%; left: 10%; transform: rotate(-45deg); opacity: 0.08; width: 200px; height: auto;" alt="Watermark">
      <img src="${logoBase64}" style="position: absolute; top: 35%; left: 50%; transform: translateX(-50%) rotate(-45deg); opacity: 0.08; width: 200px; height: auto;" alt="Watermark">
      <img src="${logoBase64}" style="position: absolute; top: 35%; right: 10%; transform: rotate(-45deg); opacity: 0.08; width: 200px; height: auto;" alt="Watermark">
      
      <img src="${logoBase64}" style="position: absolute; top: 60%; left: 10%; transform: rotate(-45deg); opacity: 0.08; width: 200px; height: auto;" alt="Watermark">
      <img src="${logoBase64}" style="position: absolute; top: 60%; left: 50%; transform: translateX(-50%) rotate(-45deg); opacity: 0.08; width: 200px; height: auto;" alt="Watermark">
      <img src="${logoBase64}" style="position: absolute; top: 60%; right: 10%; transform: rotate(-45deg); opacity: 0.08; width: 200px; height: auto;" alt="Watermark">
      
      <img src="${logoBase64}" style="position: absolute; top: 85%; left: 10%; transform: rotate(-45deg); opacity: 0.08; width: 200px; height: auto;" alt="Watermark">
      <img src="${logoBase64}" style="position: absolute; top: 85%; left: 50%; transform: translateX(-50%) rotate(-45deg); opacity: 0.08; width: 200px; height: auto;" alt="Watermark">
      <img src="${logoBase64}" style="position: absolute; top: 85%; right: 10%; transform: rotate(-45deg); opacity: 0.08; width: 200px; height: auto;" alt="Watermark">
    </div>
   
    <!-- Header -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0px; padding-bottom: 0px; border-bottom: 3px solid #0066cc;">
      <img src="${logoBase64}" style="width: 150px; height: 150px;" alt="Logo">
      <div style="text-align: right;">
        <p style="font-size: 20px; color: #666; margin: 0;">Geolocation Tracking Report</p>
      </div>
    </div>

    <!-- Content -->
    <div style="margin-top: 0px;">
     
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px 15px; font-size: 14px; font-weight: bold; width: 30%; color: #555;">Nomor Target</td>
          <td style="padding: 12px 15px; font-size: 14px; color: #333;"><strong>${input}</strong></td>
        </tr>

    ${lodayaContent}

        
        
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px 15px; font-size: 14px; font-weight: bold; width: 30%; color: #555;">Google Maps</td>
          <td style="padding: 12px 15px; font-size: 14px; color: #333;">
            <a href="${item.maps}" style="display: inline-block; color: #0066cc; text-decoration: none; font-size: 12px;">
            <img src="${mapsImage}" width="400" height="400" style="margin-top: 10px; border: 2px solid #ddd; border-radius: 8px;" />
            </a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px 15px; font-size: 14px; font-weight: bold; width: 30%; color: #555;">Waktu Tracking</td>
          <td style="padding: 12px 15px; font-size: 14px; color: #333;">${item.date}</td>
        </tr>
      </table>

      <div style="margin-top: 30px; text-align: center;">
        <p style="font-size: 12px; color: #666; margin-top: 10px;">
          📌 Lokasi: ${lat}, ${lng}
        </p>
      </div>

      <div style="padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 12px; color: #666;">
        <strong>ℹ️ Informasi Dokumen</strong><br>
        Generated: ${currentDate}<br>
      </div>
    </div>

  </body>
</html>`
  };




  
  const sharePDF = async () => {
    try {


        const ScreenShoot = await ref.current.capture();
        const base64 = await RNFS.readFile(ScreenShoot,'base64');
        console.log(ScreenShoot);
                     
    

      setLoadingPDF(true);

          const htmlContent = await generatePDFHTML(`data:image/jpg;base64,${base64}`);

      Toast.show({
        type: 'info',
        text1: 'Generating PDF...',
        text2: 'Mohon tunggu sebentar',
      });
let options = {
      html: htmlContent,
      fileName: input +'_',
      base64: true,
    };

    const file = await generatePDF(options);

    

      // // Generate HTML content
      // const htmlContent = await generatePDFHTML();

      // // Generate PDF
      // const options = {
      //   html: htmlContent,
      //   fileName: `Lodaya_Report_${input}_${Date.now()}`,
      //   directory: Platform.OS === 'ios' ? 'Documents' : 'Downloads',
      //   width: 595, // A4 width in points
      //   height: 842, // A4 height in points
      //   base64: false,
      // };

      // const file = await RNHTMLtoPDF.convert(options);
      
      // console.log('✅ PDF Generated:', file.filePath);

      // // Share PDF
      if (file.filePath) {
        
      

        if(Platform.OS=='ios'){
          const shareOptions = {
              title: "Share Lodaya Position Report",
              message: `Position Report - ${input}`,
              url: `data:application/pdf;base64,${file.base64}`,
              type: "application/pdf",
              filename: `report_${input}.pdf`,
            };


            const result = await ShareNative.share(shareOptions);

            if (result.action === ShareNative.sharedAction) {
              Toast.show({
                type: 'success',
                text1: 'PDF Berhasil Dibagikan',
                text2: 'Dokumen telah dibagikan',
              });
            } else if (result.action === ShareNative.dismissedAction) {
              Toast.show({
                type: 'info',
                text1: 'Dibatalkan',
                text2: 'Share dibatalkan',
              });
            }
        }else{


          const shareOptions = {
          title: "Share Lodaya Position Report",
          message: `Position Report - ${input}`,
          url: `file://${file.filePath}`,
          filename: `report_${input}.pdf`,

        };


          const result = await Share.open(shareOptions);

            if (result.action === Share.sharedAction) {
              Toast.show({
                type: 'success',
                text1: 'PDF Berhasil Dibagikan',
                text2: 'Dokumen telah dibagikan',
              });
            } else if (result.action === Share.dismissedAction) {
              Toast.show({
                type: 'info',
                text1: 'Dibatalkan',
                text2: 'Share dibatalkan',
              });
            }

        }

       
      }

    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      
      Alert.alert(
        'Error',
        `Gagal membuat PDF: ${error.message}`,
        [{ text: 'OK' }]
      );

      Toast.show({
        type: 'error',
        text1: 'Generate PDF Gagal',
        text2: error.message || 'Terjadi kesalahan',
      });
    } finally {
      setLoadingPDF(false);
    }
  };  

  const [mapsImg,setMapImg] = useState('');



  
  return (
    <ImageBackground
      source={require('../assets/back.png')}
      style={[styles.container, { backgroundColor: '#000' }]}
      resizeMode="cover"
    >
      <ScrollView>
        <View style={{ paddingTop: Platform.OS === 'android' ? 40 : 60, paddingHorizontal: 20 }}>
          
          <Text style={styles.title}>GEOLOCATION RESULT</Text>
          
          <MyButton 
            title={loading ? 'Saving...' : 'Save Result'} 
            onPress={saveResult} 
            disabled={loading}
          />
          <MyGap height={10} />
          
          <MyButton 
            title={loadingPDF ? 'Generating PDF...' : '📄 Share PDF'} 
            backgroundColor={colors.danger} 
            textColor={colors.white} 
            onPress={sharePDF}
            disabled={loadingPDF}
          />
          <MyGap height={10} />
 <View style={styles.cardContainer}>
            <View style={styles.cardContent}>

{renderDataRecord(item)}
            </View>
            </View>
            


        
          <View
            style={{
              ...styles.cardContainer,
              marginTop: 10,
              padding: 0,
              marginBottom: 100,
              overflow: 'hidden',
            }}
          >
            <View style={styles.cardContent}>
              <Text
                style={{
                  color: colors.black,
                  fontFamily: fonts.secondary[600],
                  fontSize: 20,
                  margin: 10,
                }}
              >
                Google Maps{' '}
                {`${item.maps.toString().split('?q=')[1].split(',')[0]}, ${
                  item.maps.toString().split('?q=')[1].split(',')[1]
                }`}
              </Text>
                  <ViewShot ref={ref}  options={{ fileName: "Your-File-Name", format: "jpg", quality: 0.9 }}>
                  <WebView

                          originWhitelist={['*']}
                                  source={{ html }}
                                  style={{ height: 400 }}
                                />

                  </ViewShot>
             
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    color: colors.black,
    fontFamily:fonts.secondary[700],
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign:'center'
  },
  cardContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 20,
  },
  cardContent: {
    flexDirection: 'column',
    gap: 10,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection:'row',
    marginBottom: 5,
    borderBottomWidth:1,
    paddingVertical:4,
    borderBlockColor:colors.blueGray[200],
  },
  label: {
    flex:0.2,
    color: colors.black,
    fontSize: 12,
    fontFamily: fonts.secondary[800],
  },
  value: {
    flex:1,
    textAlign:'right',
    color: colors.black,
    fontSize: 11,
    fontFamily: fonts.secondary[300],
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
});