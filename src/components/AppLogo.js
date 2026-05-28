import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * SA Marine Webcams logo — text-based until a logo asset is added.
 * Replace with an <Image> when you have a logo file.
 */
export default function AppLogo({ size = 'large' }) {
  const isLarge = size !== 'small';
  return (
    <View style={[styles.container, isLarge ? styles.large : styles.small]}>
      <Text style={[styles.emoji, isLarge ? styles.emojiLarge : styles.emojiSmall]}>⚓</Text>
      <View>
        <Text style={[styles.title, isLarge ? styles.titleLarge : styles.titleSmall]}>South Australia</Text>
        <Text style={[styles.sub,   isLarge ? styles.subLarge   : styles.subSmall  ]}>Marine Cams</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  large:      { paddingVertical: 4 },
  small:      {},
  emoji:      {},
  emojiLarge: { fontSize: 32 },
  emojiSmall: { fontSize: 18 },
  title:      { fontWeight: '800', color: '#0B5CAB', letterSpacing: 0.5 },
  titleLarge: { fontSize: 20 },
  titleSmall: { fontSize: 13 },
  sub:        { fontWeight: '600', color: '#00838f', letterSpacing: 1 },
  subLarge:   { fontSize: 13, textTransform: 'uppercase' },
  subSmall:   { fontSize: 9, textTransform: 'uppercase' },
});
