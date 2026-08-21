import React, { useEffect } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAnalytics } from './analytics-context';
import { useCart } from './cart-context';

const { width } = Dimensions.get('window');
export function ProductDetailScreen({ product, onOpenPolicy }) {
  const { add } = useCart(); const { log } = useAnalytics();
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  useEffect(() => { log('product_viewed', { productId: product.id, title: product.title, timestamp: new Date().toISOString() }); }, [product.id, product.title, log]);
  const handleAdd = () => { add(product); log('add_to_cart', { productId: product.id, price: discountedPrice, timestamp: new Date().toISOString() }); };
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.carousel}>
      {(product.images?.length ? product.images : [product.thumbnail]).map((uri, index) => <Image key={`${uri}-${index}`} source={{ uri }} style={styles.image} resizeMode="contain" />)}
    </ScrollView>
    <Text style={styles.imageHint}>{product.images?.length > 1 ? 'Swipe to see more photos' : ''}</Text>
    <Text style={styles.brand}>{product.brand || product.category}</Text><Text style={styles.title}>{product.title}</Text>
    <View style={styles.priceRow}><Text style={styles.price}>${discountedPrice.toFixed(2)}</Text><Text style={styles.original}>${product.price.toFixed(2)}</Text><Text style={styles.discount}>{product.discountPercentage.toFixed(0)}% off</Text></View>
    <Text style={styles.rating}>★ {product.rating?.toFixed(1) || 'New'} <Text style={styles.stock}> · {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</Text></Text>
    <Text style={styles.sectionTitle}>About this item</Text><Text style={styles.description}>{product.description}</Text>
    <TouchableOpacity style={[styles.add, product.stock <= 0 && styles.disabled]} disabled={product.stock <= 0} onPress={handleAdd}><Text style={styles.addText}>{product.stock > 0 ? 'Add to cart' : 'Out of stock'}</Text></TouchableOpacity>
    <TouchableOpacity style={styles.policy} onPress={onOpenPolicy}><Text style={styles.policyText}>Read our return policy →</Text></TouchableOpacity>
  </ScrollView>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fffdf9' }, content: { paddingBottom: 34 }, carousel: { height: width * 0.82, backgroundColor: '#f4f0eb' }, image: { width, height: width * 0.82 }, imageHint: { height: 24, textAlign: 'center', paddingTop: 6, color: '#81766d', fontSize: 12 }, brand: { marginHorizontal: 20, marginTop: 12, color: '#a05537', textTransform: 'uppercase', fontSize: 12, fontWeight: '800', letterSpacing: 1 }, title: { marginHorizontal: 20, marginTop: 6, color: '#2b2622', fontSize: 25, fontWeight: '800', lineHeight: 31 }, priceRow: { margin: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }, price: { color: '#a05537', fontSize: 25, fontWeight: '800' }, original: { color: '#81766d', textDecorationLine: 'line-through', fontSize: 16 }, discount: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: 'hidden', color: '#5d4225', backgroundColor: '#fee3c4', fontSize: 12, fontWeight: '800' }, rating: { marginHorizontal: 20, color: '#a05537', fontWeight: '800' }, stock: { color: '#81766d', fontWeight: '400' }, sectionTitle: { marginHorizontal: 20, marginTop: 28, marginBottom: 8, color: '#2b2622', fontSize: 17, fontWeight: '800' }, description: { marginHorizontal: 20, color: '#625950', fontSize: 15, lineHeight: 23 }, add: { marginHorizontal: 20, marginTop: 30, paddingVertical: 16, borderRadius: 13, alignItems: 'center', backgroundColor: '#a05537' }, disabled: { backgroundColor: '#b8afa8' }, addText: { color: 'white', fontSize: 16, fontWeight: '800' }, policy: { marginTop: 20, alignItems: 'center' }, policyText: { color: '#a05537', fontWeight: '700' }
});
