import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  ActivityIndicator,
  Animated,
  Easing,
  Alert,
  ScrollView,
} from 'react-native';
import { windowWidth } from '../utils/localStorage';
import { colors } from '../utils/colors';
import axios from 'axios';
import MyButton from '../components/MyButton';
import MyGap from '../components/MyGap';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import Sound from 'react-native-nitro-sound';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';

export default function AIloday({ navigation, route }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [silenceTimer, setSilenceTimer] = useState(null);
  const [lastVolume, setLastVolume] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef(); // Ref untuk auto-scroll ScrollView
  const silenceThreshold = 2000; // 2 detik tanpa suara = auto stop

  // Animasi pulse
  useEffect(() => {
    let pulse;
    if (isRecording || isSpeaking) {
      pulse = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 800,
              easing: Easing.out(Easing.exp),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 800,
              easing: Easing.in(Easing.exp),
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      pulse.start();
    } else {
      scaleAnim.setValue(1); // Reset scale saat tidak merekam/berbicara
      if (pulse) pulse.stop(); // Pastikan animasi berhenti
    }
    return () => {
      if (pulse) pulse.stop();
    };
  }, [isRecording, isSpeaking, scaleAnim]);

  const requestMicrophonePermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.MICROPHONE
          : PERMISSIONS.ANDROID.RECORD_AUDIO;

      const result = await check(permission);

      if (result === RESULTS.GRANTED) {
        return true;
      }

      if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
        const req = await request(permission);
        if (req === RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert(
            'Izin Mikrofon Diperlukan',
            'Silakan aktifkan izin mikrofon di Pengaturan untuk menggunakan fitur ini.'
          );
          return false;
        }
      }

      if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Izin Mikrofon Diblokir',
          'Silakan buka Pengaturan > Privasi > Mikrofon untuk mengaktifkan izin.'
        );
        return false;
      }

      return false;
    } catch (err) {
      console.error('⚠️ Permission error:', err);
      return false;
    }
  };

  function angkaKeTeks(teks) {
    const angkaMap = {
      '0': 'kosong', '1': 'satu', '2': 'dua', '3': 'tiga', '4': 'empat',
      '5': 'lima', '6': 'enam', '7': 'tujuh', '8': 'delapan', '9': 'sembilan',
    };

    return teks.replace(/\d+/g, (match) =>
      match.split('').map((d) => angkaMap[d] || d).join(' ')
    );
  }

  // TTS dengan ElevenLabs
  const speakText = async (text) => {
    try {
      setIsSpeaking(true);
      console.log('🗣️ Mengirim ke ElevenLabs:', text);

      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/NPDHDOOQCSyifTJZOe6J`,
        {
          text: angkaKeTeks(text),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 1,
            speed: 1.2,
          },
        },
        {
          headers: {
            'xi-api-key': process.env.ELE_API_KEY,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
          timeout: 20000,
        }
      );

      const filePath = `${RNFS.DocumentDirectoryPath}/speech_${Date.now()}.mp3`;
      const buffer = Buffer.from(response.data, 'binary');
      await RNFS.writeFile(filePath, buffer.toString('base64'), 'base64');

      await Sound.startPlayer(`file://${filePath}`);

      // Auto start recording setelah selesai bicara
      Sound.addPlayBackListener((e) => {
        if (e.currentPosition >= e.duration) {
          Sound.removePlayBackListener();
          setIsSpeaking(false);
          // Selalu coba mulai merekam setelah selesai bicara
          setTimeout(() => {
            if (!isRecording) { // Pastikan tidak ada rekaman yang sedang berjalan
              startRecording();
            }
          }, 500); // Penundaan singkat sebelum mulai mendengarkan lagi
        }
      });

    } catch (error) {
      console.error('❌ TTS Error:', error);
      setIsSpeaking(false);
      Alert.alert('TTS Gagal', 'Tidak dapat mengakses ElevenLabs API.');
      // Jika ada error TTS, coba mulai merekam lagi agar tetap bisa mendengarkan
      setTimeout(() => {
        if (!isRecording) {
          startRecording();
        }
      }, 1000);
    }
  };

  // Proses perintah user
  const processCommand = async (text) => {
    console.log('📝 Processing:', text);

    // Tambahkan ke conversation
    setConversation(prev => [...prev, { role: 'user', text }]);

    let response = '';

    // Cek greeting
    if (!isInitialized && text.toLowerCase().replace(/[^a-z0-9]/g, '').includes('lodayamonitor')) {
      response = '86 ! Apa yang bisa saya bantu?';
      setIsInitialized(true);
    }
    // Cek lacak (hanya jika sudah diinisialisasi)
    else if (isInitialized && text.toLowerCase().includes('lacak')) {
      const nomorLacak = text.replace(/[^0-9]/g, '');
      response = `Siap ! Saya cek ya`;

      setConversation(prev => [...prev, { role: 'assistant', text: response }]);
      await speakText(response);

      // Proses tracking
      try {
        const trackResponse = await fetch(process.env.API_URL + '/cp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'cpall',
            input: nomorLacak,
          }),
        });

        let hasil = await trackResponse.json();

        if (hasil.ok && hasil.data.status) {
          const detailResponse = `Lokasi ditemukan di ${hasil.data.result[0].alamat}`;
          setConversation(prev => [...prev, { role: 'assistant', text: detailResponse }]);
          await speakText(detailResponse);

          Alert.alert('Lokasi ditemukan', 'Lihat detail?', [
            { text: 'TUTUP' },
            {
              text: 'LIHAT DETAIL',
              onPress: () => {
                navigation.navigate('MpositionDetail', {
                  item: hasil.data.result,
                  input: hasil.data.input,
                });
              },
            },
          ]);
        } else {
          response = 'Maaf, data tidak ditemukan';
          setConversation(prev => [...prev, { role: 'assistant', text: response }]);
          await speakText(response);
        }
      } catch (error) {
        console.error('❌ Tracking error:', error);
        response = 'Maaf, terjadi kesalahan saat melacak';
        setConversation(prev => [...prev, { role: 'assistant', text: response }]);
        await speakText(response);
      }
      return; // Penting agar tidak menjalankan respons default di bawah
    }
    else if (isInitialized) { // Respons umum jika sudah diinisialisasi
      response = `Oke, ${text}. Ada yang lain?`;
    } else { // Jika belum diinisialisasi dan bukan wake word
      response = 'Silakan awali dengan "Lodaya Monitor" terlebih dahulu';
    }

    setConversation(prev => [...prev, { role: 'assistant', text: response }]);
    await speakText(response);
  };

  // Start Recording dengan auto-stop
  const startRecording = async () => {
    if (isRecording) {
      console.log('Sudah merekam, skip startRecording.');
      return;
    }

    try {
      console.log('Mulai merekam...');
      await Sound.startRecorder();
      setIsRecording(true);

      // Clear timer sebelumnya dan segera set timer baru saat rekaman dimulai.
      // Ini memastikan rekaman akan berhenti otomatis meskipun hening dari awal.
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
      const initialSilenceTimer = setTimeout(() => {
        console.log('Hening awal terlampaui, menghentikan rekaman...');
        stopRecording();
      }, silenceThreshold);
      setSilenceTimer(initialSilenceTimer);

      Sound.addRecordBackListener((e) => {
        const currentVolume = e.currentMetering || 0;

        // Jika suara terdeteksi (di atas ambang batas), reset timer hening.
        if (currentVolume > -40) { // Ambang batas volume untuk mendeteksi suara
          if (silenceTimer) { // Hapus timer yang sedang berjalan (baik itu timer awal atau dari aktivitas sebelumnya)
            clearTimeout(silenceTimer);
          }
          // Set timer baru. Timer ini akan menentukan kapan rekaman berhenti setelah aktivitas suara.
          const newTimer = setTimeout(() => {
            console.log('Hening terdeteksi setelah aktivitas, menghentikan rekaman...');
            stopRecording();
          }, silenceThreshold);
          setSilenceTimer(newTimer);
        }
        // Jika hening (currentVolume <= -40), kita tidak melakukan apa-apa.
        // Timer yang sudah ada (baik itu timer awal, atau yang di-set setelah aktivitas suara terakhir)
        // akan terus menghitung mundur. Jika waktu habis, stopRecording akan dipanggil.

        setLastVolume(currentVolume);
      });

    } catch (error) {
      console.error('❌ Recording error:', error);
      setIsRecording(false);
      Alert.alert('Gagal Merekam', 'Tidak dapat memulai rekaman. Pastikan izin mikrofon diberikan.');
      // Setelah error, coba mulai merekam lagi untuk melanjutkan mendengarkan
      setTimeout(() => {
        if (!isRecording) {
          startRecording();
        }
      }, 1000);
    }
  };

  // Stop Recording dan proses
  const stopRecording = async () => {
    if (!isRecording) {
      console.log('Tidak sedang merekam, skip stopRecording.');
      return;
    }

    try {
      console.log('Menghentikan rekaman...');
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        setSilenceTimer(null);
      }
      // Hapus listener segera sebelum menghentikan perekam untuk menghindari bug
      Sound.removeRecordBackListener();

      const result = await Sound.stopRecorder();
      setIsRecording(false);
      setIsProcessing(true);

      console.log('🎙️ Rekaman disimpan:', result);

      const isIOS = Platform.OS === 'ios';
      const extension = isIOS ? 'm4a' : 'mp4';
      const mimeType = isIOS ? 'audio/m4a' : 'audio/mp4';

      // Kirim ke OpenAI Whisper
      const formData = new FormData();
      formData.append('file', {
        uri: result,
        type: mimeType,
        name: `recording.${extension}`,
      });
      formData.append('model', 'whisper-1');

      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${process.env.GPT_API_KEY}`,
          },
        }
      );

      const transcribedText = response.data.text;
      console.log('📝 Transcription:', transcribedText);

      if (transcribedText && transcribedText.trim().length > 0) {
        await processCommand(transcribedText);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Tidak ada suara terdeteksi',
          text2: 'Silakan coba lagi',
        });
        // Auto restart recording jika tidak ada ucapan, untuk terus mendengarkan
        setTimeout(() => startRecording(), 1000);
      }

    } catch (error) {
      console.error('❌ Stop recording error:', error);
      Alert.alert('Error', 'Gagal memproses rekaman.');
      // Jika terjadi error saat memproses, pastikan rekaman bisa dimulai kembali
      setTimeout(() => {
        if (!isRecording) {
          startRecording();
        }
      }, 1000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Effect hook untuk setup awal dan cleanup
  useEffect(() => {
    const init = async () => {
      console.log("Menginisialisasi komponen AIloday...");
      const granted = await requestMicrophonePermission();
      if (granted) {
        // Mulai merekam segera untuk mendengarkan wake word
        console.log("Izin mikrofon diberikan, memulai rekaman awal...");
        setTimeout(() => { // Penundaan kecil untuk memastikan semua state sudah siap
          if (!isRecording) { // Hindari memulai jika sudah merekam
            startRecording();
          }
        }, 1000); // Penundaan 1 detik
      } else {
        Alert.alert(
          'Izin Mikrofon',
          'Untuk menggunakan fitur suara, aplikasi ini memerlukan izin mikrofon. Mohon berikan izin di pengaturan perangkat Anda.'
        );
      }
    };

    init();

    // Fungsi cleanup saat komponen unmount
    return () => {
      console.log("Membersihkan komponen AIloday...");
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
      // Pastikan semua listener dihapus dan rekaman/playback dihentikan
      Sound.removeRecordBackListener();
      Sound.removePlayBackListener();
      // Pastikan untuk menghentikan recorder dan player jika masih aktif
      if (isRecording) {
        Sound.stopRecorder().catch(e => console.log("Error stopping recorder on unmount:", e));
      }
      if (isSpeaking) {
        Sound.stopPlayer().catch(e => console.log("Error stopping player on unmount:", e));
      }
    };
  }, []); // Array dependensi kosong berarti effect ini berjalan sekali saat mount dan cleanup saat unmount

  // Tombol manual masih ada untuk override
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <ImageBackground
      source={require('../assets/back.png')}
      style={[styles.container, { backgroundColor:colors.primary }]}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />

        {/* Conversation History */}
        <ScrollView
          style={styles.conversationContainer}
          contentContainerStyle={styles.conversationContent}
          ref={scrollViewRef} // Kaitkan ref ke ScrollView
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })} // Auto-scroll ke pesan terbaru
        >
          {conversation.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Status Visual */}
        <View style={styles.statusContainer}>
          {(isRecording || isSpeaking) ? (
            <Animated.Image
              source={require('../assets/nagamerah.png')}
              style={[
                styles.statusImage,
                { transform: [{ scale: scaleAnim }] },
              ]}
            />
          ) : (
            // Tampilkan gambar statis saat tidak merekam/berbicara
            <Image
              source={require('../assets/nagamerah.png')}
              style={styles.statusImage}
            />
          )}

          {isProcessing && (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.statusText}>Memproses...</Text>
            </View>
          )}

          {!isRecording && !isProcessing && !isSpeaking && (
            <Text style={styles.statusText}>
              {isInitialized ? 'Sedang mendengarkan' : 'Menunggu "Lodaya Monitor"'}
            </Text>
          )}

          {isRecording && (
            <Text style={styles.recordingText}>🎙️ Mendengarkan... (Volume: {lastVolume.toFixed(2)})</Text>
          )}

          {isSpeaking && (
            <Text style={styles.speakingText}>🔊 Berbicara...</Text>
          )}
        </View>
      </View>

      {/* Control Button (tetap pertahankan untuk override manual) */}
      <View style={styles.controlContainer}>
        <MyButton
          title={isRecording ? '⏹️ Hentikan Mendengarkan' : '🎙️ Mulai Mendengarkan'}
          onPress={toggleRecording}
          disabled={isProcessing || isSpeaking}
        />
        <MyGap height={10} />
        {isInitialized && (
          <TouchableOpacity
            onPress={() => {
              setIsInitialized(false);
              setIsProcessing(false);
              setConversation([]);
              Toast.show({
                type: 'success',
                text1: 'Sesi direset',
              });
              // Setelah reset, pastikan aplikasi kembali mendengarkan untuk wake word
              if (!isRecording) {
                startRecording();
              }
            }}
            style={styles.resetButton}
          >
            <Text style={styles.resetText}>Reset Percakapan</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    paddingHorizontal: 20,
    flex: 1,
  },
  logo: {
    width: 200,
    height: 160,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  conversationContainer: {
    flex: 1,
    marginTop: 20,
  },
  conversationContent: {
    paddingBottom: 20,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: 'rgba(107, 114, 128, 0.8)',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  statusImage: {
    width: windowWidth / 2,
    height: windowWidth / 2,
    resizeMode: 'contain',
  },
  processingContainer: {
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  recordingText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  speakingText: {
    color: '#22c55e',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  controlContainer: {
    padding: 20,
  },
  resetButton: {
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    borderRadius: 8,
    alignItems: 'center',
  },
  resetText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});