import React from 'react';
import { ImageBackground } from 'react-native';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function TelegramBotView() {
  return (
    <ImageBackground source={require('../assets/back.png')} style={{
        flex:1
    }}>
<View style={{
        
        flex:1,
    }}>
        <WebView
      injectedJavaScript={`
    const hide = () => {
      const el = document.querySelector(".tgme_head_wrap");
      if (el) {
        el.style.display = "none";
      }
    };
    hide();
  `}
      source={{ uri: "https://t.me/loday4_bot" }}
      style={{ flex: 1,opacity:0.8 }}
    />
    </View>
    </ImageBackground>
  );
}
