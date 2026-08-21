import React, { useEffect, useState } from 'react';
import { AppState, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CartProvider, useCart } from './src/cart-context';
import { AnalyticsProvider, useAnalytics } from './src/analytics-context';
import { ProductListScreen } from './src/ProductListScreen';
import { ProductDetailScreen } from './src/ProductDetailScreen';
import { PolicyScreen } from './src/PolicyScreen';

function AppShell() {
  const [route, setRoute] = useState({ name: 'products' });
  const { itemCount } = useCart();
  const { log } = useAnalytics();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        log('app_backgrounded', { timestamp: new Date().toISOString() });
      }
    });
    return () => subscription.remove();
  }, [log]);

  const goBack = () => setRoute({ name: 'products' });
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        {route.name !== 'products' ? <TouchableOpacity onPress={goBack} hitSlop={10}><Text style={styles.back}>‹ Back</Text></TouchableOpacity> : <Text style={styles.brand}>nua</Text>}
        <Text style={styles.title}>{route.name === 'policy' ? 'Return policy' : route.name === 'detail' ? 'Product details' : 'Discover'}</Text>
        <View style={styles.cart}><Text style={styles.cartIcon}>🛍</Text>{itemCount > 0 && <Text style={styles.cartCount}>{itemCount}</Text>}</View>
      </View>
      {route.name === 'products' && <ProductListScreen onOpenProduct={(product) => setRoute({ name: 'detail', product })} />}
      {route.name === 'detail' && <ProductDetailScreen product={route.product} onOpenPolicy={() => setRoute({ name: 'policy' })} />}
      {route.name === 'policy' && <PolicyScreen />}
    </SafeAreaView>
  );
}

export default function App() {
  return <AnalyticsProvider><CartProvider><AppShell /></CartProvider></AnalyticsProvider>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fffdf9', marginTop: Platform.OS === 'android' ? 25 : 0 },
  header: { height: 58, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#e8e2da' },
  brand: { width: 66, color: '#a05537', fontSize: 26, fontWeight: '800', letterSpacing: -1 },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#2b2622' },
  back: { width: 66, color: '#a05537', fontSize: 16, fontWeight: '700' },
  cart: { width: 42, alignItems: 'flex-end' }, cartIcon: { fontSize: 19 },
  cartCount: { position: 'absolute', top: -8, right: -9, minWidth: 17, textAlign: 'center', borderRadius: 9, overflow: 'hidden', color: 'white', backgroundColor: '#a05537', fontSize: 11, fontWeight: '800', paddingHorizontal: 3 }
});
