import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../utils/colors';
import axios from 'axios';
import MyButton from '../components/MyButton';
import MyGap from '../components/MyGap';
import { fonts, windowWidth } from '../utils/fonts';
import Toast from 'react-native-toast-message';
import { getData, LODAY_HEADER } from '../utils/localStorage';

export default function Result({ navigation, route }) {
  const item = route.params.item;
  const id_request = route.params.id_request;
  const id_request2 = route.params.id_request_photo;

  console.log(id_request);
  console.log(id_request2);
  const inputITEM = route.params.input;
  const methodITEM = route.params.method;
  const VALUE = route.params.input;

  const [data, setData] = useState([]);
  const [data2,setData2] = useState([]);
  const [error, setError] = useState(null);

 const __getDataFromAPI = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await axios.get(
      `${process.env.API_URL_LOCAL}/azemin/${id_request}`,
      { timeout: 30000 }
    );

    // 🔍 Cek status HTTP
    if (response.status !== 200) {
      throw new Error(`Server mengembalikan status ${response.status}`);
    }

    const data = response.data?.data?.result?.data?.gateway?.data;

    if (!data) {
      // Jika data belum siap — tidak error tapi coba reload
      console.log('⚠️ Data belum siap, akan reload otomatis...');
      setTimeout(() => __getDataFromAPI(), 8000);
      return;
    }

    // 🧩 Format data menjadi array rapi
    const formattedList = Object.entries(data).flatMap(([dbKey, tables]) =>
      Object.entries(tables)
        .filter(([tbKey, arr]) => Array.isArray(arr) && arr.length > 0)
        .map(([tbKey, arr]) => ({
          id: `${dbKey}_${tbKey}`,
          db: dbKey,
          table: tbKey,
          count: arr.length,
          data: arr,
        }))
    );

    console.log('✅ Formatted List:', formattedList);
    setData(formattedList);

    if(methodITEM=='NIK' || methodITEM=='MSISDN'){
        const response2 = await axios.get(
              `${process.env.API_URL_LOCAL}/azemin/${id_request2}`,
              { timeout: 30000 }
            );

            // 🔍 Cek status HTTP
            if (response2.status !== 200) {
              throw new Error(`Server mengembalikan status ${response2.status}`);
            }

            const data2 = response2.data?.data?.result?.data?.gateway?.data;

            if (!data2) {
              // Jika data belum siap — tidak error tapi coba reload
              console.log('⚠️ Data belum siap, akan reload otomatis...');
              setTimeout(() => __getDataFromAPI(), 8000);
              return;
            }

            // 🧩 Format data menjadi array rapi
            const formattedList2 = Object.entries(data2).flatMap(([dbKey, tables]) =>
              Object.entries(tables)
                .filter(([tbKey, arr]) => Array.isArray(arr) && arr.length > 0)
                .map(([tbKey, arr]) => ({
                  id: `${dbKey}_${tbKey}`,
                  db: dbKey,
                  table: tbKey,
                  count: arr.length,
                  data: arr,
                }))
            );

            console.log('✅ Formatted photo:', formattedList2[0].data);
            setData2(formattedList2[0].data);


    }



  } catch (err) {
    console.log('❌ Error fetching data:', err);

    let errorMessage = 'Gagal mengambil data';
    if (err.code === 'ECONNABORTED') {
      errorMessage = '⏱️ Koneksi timeout, silakan coba lagi';
    } else if (err.response) {
      errorMessage = `🚫 Server error: ${err.response.status}`;
    } else if (err.request) {
      errorMessage = '🌐 Tidak dapat terhubung ke server';
    } else if (err.message) {
      errorMessage = err.message;
    }

    setError(errorMessage);

    // 🔔 Notifikasi opsional
    if (typeof Toast !== 'undefined') {
      Toast.show({
        type: 'error',
        text1: 'Terjadi kesalahan',
        text2: errorMessage,
      });
    }
  } finally {
    setLoading(false);
  }
};

// Jalankan otomatis saat mount
useEffect(() => {
  setLoading(true);
  const timer = setTimeout(() => {
    __getDataFromAPI();
  }, 10000);

  return () => clearTimeout(timer);
}, []);


  
  // Format field name untuk ditampilkan (capitalize dan replace underscore)
  const formatFieldName = (key) => {
    const isAllCaps = /^[A-Z0-9_]+$/.test(key);

  if (isAllCaps) {
    return key.replace(/_/g, " ").trim();
  }

  return key
    .replace(/_/g, " ")                                  // snake_case → spasi
    .replace(/([a-z]+)([A-Z]{2,})/g, "$1 $2")            // tglSTNK → tgl STNK (block kapital, tidak dipecah)
    .replace(/([a-z])([A-Z])/g, "$1 $2")                 // camelCase umum
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());  
  };


  const [expandedItems, setExpandedItems] = useState({});

 const toggleExpand = (itemKey) => {
  setExpandedItems((prev) => ({
    ...prev,
    [itemKey]: !prev[itemKey],
  }));
};



 const renderDataRecord = (record, index, itemId) => {
  const itemKey = `${itemId}_${index}`;
  const isExpanded = expandedItems[itemKey];

  const entries = Object.entries(record);

  // tampilkan hanya 5 data pertama jika collapse
  const displayEntries = isExpanded ? entries : entries.slice(0, 5);

  return (
    <View key={index} style={styles.recordContainer}>

      

      <Text style={styles.recordTitle}>Data #{index + 1}</Text>

      {displayEntries.map(([key, value]) => (
        <View key={key} style={styles.dataRow}>
          <Text style={styles.fieldName}>{formatFieldName(key)}</Text>
          <Text style={styles.fieldValue}>
            {value !== null && value !== undefined ? String(value) : "-"}
          </Text>
        </View>
      ))}

      {entries.length > 5 && (
        <TouchableOpacity
          onPress={() => toggleExpand(itemKey)}
          style={styles.expandButton}
        >
          <Text style={styles.expandText}>
            {isExpanded ? "Tutup" : "Lihat Semua"}
          </Text>
        </TouchableOpacity>
      )}

    </View>
  );
};

  

  // Render setiap item database/table
  const renderItem = ({ item }) => {
    return (
      <View style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <View style={styles.tableHeaderLeft}>
            <Text style={styles.dbLabel}>Database: {item.db}</Text>
            <Text style={styles.tableLabel}>Table: {item.table}</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{item.count}</Text>
          </View>
        </View>

        {item.data.map((record, index) =>
          renderDataRecord(record, index, item.id)
        )}
      </View>
    );
  };


  const [loading,setLoading] = useState(false);
 const saveResult = async () => {
  try {
    const user = await getData("user");

    const dataForm = {
      method: methodITEM,
      input: inputITEM,
      fid_pengguna: user.id,
      lodaya: data,
    };

    console.log("🟢 Data yang dikirim:", dataForm);

    setLoading(true);

    const response = await axios.post(
      `${process.env.API_URL_LOCAL}/logz`,
      dataForm,
      LODAY_HEADER()
    );

    console.log("🟢 Respons server:", response.data);

    if (response.data?.ok) {
      Toast.show({
        type: "success",
        text1: "Loday4 message",
        text2: "✅ Result berhasil disimpan!",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Loday4 message",
        text2: "⚠️ Server mengembalikan respons tidak valid.",
      });
    }
  } catch (error) {
    console.log("❌ Error saat POST:", error);

    let message = "Tidak ada respons dari server.";

    if (error.response) {
      // Server merespons tapi status bukan 2xx
      console.log("🔴 Error Response Data:", error.response.data);
      console.log("🔴 Error Response Status:", error.response.status);
      console.log("🔴 Error Response Headers:", error.response.headers);

      message = `Server error (${error.response.status}): ${
        error.response.data?.message || "Terjadi kesalahan di server."
      }`;
    } else if (error.request) {
      // Request dikirim tapi tidak ada respons
      console.log("🔴 Tidak ada respons dari server:", error.request);
      message = "Server tidak merespons, mungkin offline atau CORS error.";
    } else {
      // Error lainnya (misalnya salah URL, konfigurasi, dsb)
      console.log("🔴 Axios Error Message:", error.message);
      message = `Kesalahan konfigurasi: ${error.message}`;
    }

    Toast.show({
      type: "error",
      text1: "Loday4 message",
      text2: message,
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <ImageBackground
      source={require('../assets/back.png')}
      style={[styles.container, { backgroundColor: '#000' }]}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <Image
          source={require('../assets/logow.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>{item.title} Result</Text>

        {data.length==0 && 
          <MyButton 
          title={loading ? "Loading..." : "Reload Data"} 
          onPress={__getDataFromAPI}
          disabled={loading}
        />
        }
        <MyGap height={10} />

        {/* Info Card */}
        <View style={styles.infoCard}>
          {/* <View style={styles.row}>
            <Text style={styles.label}>ReqID</Text>
            <Text style={styles.value}>{id_request}</Text>
          </View> */}
          <View style={styles.row}>
            <Text style={styles.label}>Search</Text>
            <Text style={styles.value}>{VALUE}</Text>
          </View>
        </View>

        <MyGap height={20} />
      </View>

      {/* Content Area */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <MyGap height={20} />
          <MyButton title="Coba Lagi" onPress={__getDataFromAPI} />
        </View>
      ) : data.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Tidak ada data ditemukan</Text>
        </View>
      ) : (
        <ScrollView style={{
          flex:1,
  }}>
        <View style={{
          paddingVertical:10,
          paddingHorizontal:20,
        }}><MyButton title="Save Result" onPress={saveResult}  /></View>

       {data2.length > 0 &&
       
        <View style={{
          marginHorizontal:20,
          paddingHorizontal:10,
          flexDirection:'row',
          backgroundColor:colors.white,
          borderRadius:10,
          marginBottom:10,
          flexGrow:1,
        }}>
            <ScrollView horizontal>
              {data2.map((i,idx)=>{
              return (
                <View key={idx} sty>
                   <Image source={{
                  uri:`data:image/png;base64,${i.photo}`
                }} style={{
                  width:windowWidth/3,
                  height:200,
                  resizeMode:'contain',
                  marginHorizontal:4,
                  borderRadius:10,
                }} />
                  <Text>Database: {i.col_desc_id_db_category_photo}</Text>
               
                </View>
              )
            })}
            </ScrollView>
        
       </View>
      

      
       
       }


        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
        </ScrollView>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 45,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  title: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: colors.black,
    fontSize: 12,
    fontFamily:fonts.secondary[600]
 
  },
  value: {
       color: colors.black,
    fontSize: 14,
       fontFamily:fonts.secondary[600],
    textAlign: 'right',
    flexShrink: 1,
    maxWidth: '70%',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  tableCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  tableHeaderLeft: {
    flex: 1,
  },
  dbLabel: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  tableLabel: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '500',
  },
  countBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  recordContainer: {
    backgroundColor:colors.primary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  recordTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  fieldName: {
   color: colors.black,
    fontSize: 11,
    fontFamily:fonts.primary[400],
    fontWeight: '500',
    flex: 1,
  },
  fieldValue: {
    color: colors.black,
    fontSize: 12,
    fontFamily:fonts.primary[700],
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  expandButton: {
    marginTop: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  expandButtonText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    color: colors.white,
    fontSize: 16,
    marginTop: 15,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyText: {
    color: '#ddd',
    fontSize: 16,
    textAlign: 'center',
  },
   buttonText: { color: '#fff', fontWeight: 'bold' },
    expandButton: { paddingVertical: 8 },
    expandText: {
      fontSize: 14,
      fontFamily:fonts.secondary[700],
      color: "blue",
      textDecorationLine: "underline",
    },
});