import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export function PolicyScreen() {
  return <View style={styles.screen}><WebView source={{ uri: 'https://www.termsfeed.com/live/1d1b4689-2b3d-4a25-8a77-36cc2cab5322' }} startInLoadingState renderLoading={() => <ActivityIndicator style={styles.loader} color="#a05537" />} /></View>;
}
const styles = StyleSheet.create({ screen: { flex: 1 }, loader: { flex: 1 } });
