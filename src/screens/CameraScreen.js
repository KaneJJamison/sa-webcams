import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Platform, StatusBar, Linking,
} from 'react-native';
import { useFavourites } from '../context/FavouritesContext';
import { REGION_COLORS, getEmbedUrl } from '../data/cameras';
import AdBanner from '../components/AdBanner';

let WebView;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

export default function CameraScreen({ route }) {
  const { camera } = route.params;
  const { favourites, toggleFavourite } = useFavourites();
  const isFav = favourites.has(camera.id);
  const color  = REGION_COLORS[camera.region] || '#0B5CAB';
  const embedUrl = getEmbedUrl(camera.embedId);

  const [feedHeight, setFeedHeight] = useState(300);

  // Spoof referrer so Verkada's domain check sees an allowed origin
  const REFERRER_SPOOF = `
    (function(){
      try {
        Object.defineProperty(document, 'referrer', {
          get: function(){ return 'https://www.marinesafety.sa.gov.au/'; },
          configurable: true
        });
      } catch(e){}
    })(); true;
  `;

  // Script to report iframe content height back to RN
  const HEIGHT_SCRIPT = `
    (function(){
      function report(){
        var h = Math.max(
          document.body ? document.body.scrollHeight : 0,
          document.documentElement ? document.documentElement.scrollHeight : 0,
          300
        );
        window.ReactNativeWebView.postMessage(JSON.stringify({type:'height',value:h}));
      }
      report();
      setTimeout(report, 1500);
      setTimeout(report, 4000);
    })(); true;
  `;

  const renderFeed = () => {
    if (Platform.OS === 'web') {
      // Verkada embeds block cross-origin iframes on web — link out instead
      return (
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackIcon}>📷</Text>
          <Text style={styles.webFallbackText}>Live feed available on iOS & Android</Text>
          <TouchableOpacity
            style={styles.webFallbackBtn}
            onPress={() => Linking.openURL('https://marinesafety.sa.gov.au/web-cameras')}
          >
            <Text style={styles.webFallbackBtnText}>View on Marine Safety SA ↗</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <WebView
        source={{ uri: embedUrl }}
        style={StyleSheet.absoluteFill}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        allowsFullscreenVideo
        scalesPageToFit={false}
        injectedJavaScriptBeforeContentLoaded={REFERRER_SPOOF}
        injectedJavaScript={HEIGHT_SCRIPT}
        onMessage={e => {
          try {
            const msg = JSON.parse(e.nativeEvent.data);
            if (msg.type === 'height' && msg.value > 100) {
              setFeedHeight(Math.min(msg.value, 500));
            }
          } catch {}
        }}
      />
    );
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <StatusBar barStyle="dark-content" />

      {/* Top row: region badge + favourite */}
      <View style={styles.topRow}>
        <View style={[styles.regionBadge, { borderColor: color + '66', backgroundColor: color + '18' }]}>
          <View style={[styles.regionDot, { backgroundColor: color }]} />
          <Text style={[styles.regionText, { color }]}>{camera.region}</Text>
        </View>
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => toggleFavourite(camera.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.favStar, isFav && styles.favStarActive]}>
            {isFav ? '★' : '☆'}
          </Text>
          <Text style={[styles.favLabel, isFav && styles.favLabelActive]}>
            {isFav ? 'Saved' : 'Favourite'}
          </Text>
        </TouchableOpacity>
      </View>

      <AdBanner position="top" />

      {/* Live feed */}
      <View style={[styles.feedWrapper, { height: feedHeight }]}>
        {renderFeed()}
      </View>

      <AdBanner position="bottom" />

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        Live images provided by SA Department for Infrastructure and Transport via Marine Safety SA.
        Use as a guide only — cameras may be offline during servicing or network outages.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:   { flex: 1, backgroundColor: '#f5f5f5' },
  content:  { paddingBottom: 32 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  regionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  regionDot:  { width: 8, height: 8, borderRadius: 4 },
  regionText: { fontSize: 13, fontWeight: '600' },
  favBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  favStar:        { fontSize: 22, color: '#ccc' },
  favStarActive:  { color: '#e67e00' },
  favLabel:       { fontSize: 13, color: '#aaa' },
  favLabelActive: { color: '#e67e00', fontWeight: '600' },
  feedWrapper: {
    width: '100%',
    backgroundColor: '#0d1b2a',
    overflow: 'hidden',
  },
  webFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  webFallbackIcon: { fontSize: 40 },
  webFallbackText: { fontSize: 14, color: '#aaa', textAlign: 'center' },
  webFallbackBtn: {
    backgroundColor: '#0B5CAB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  webFallbackBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  disclaimer: {
    fontSize: 11,
    color: '#aaa',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    lineHeight: 16,
  },
});
