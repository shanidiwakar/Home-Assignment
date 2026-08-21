import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAnalytics } from './analytics-context';
import { useProducts } from './useProducts';

function ProductCard({ item, onPress }) {
  const discounted = item.price * (1 - item.discountPercentage / 100);
  return <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
    <View style={styles.cardText}><Text numberOfLines={1} style={styles.productTitle}>{item.title}</Text><Text numberOfLines={1} style={styles.category}>{item.category}</Text><Text style={styles.price}>${discounted.toFixed(2)}</Text></View>
  </TouchableOpacity>;
}

export function ProductListScreen({ onOpenProduct }) {
  
  const [input, setInput] = useState(''); const [query, setQuery] = useState('');
  
  const { log } = useAnalytics();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input !== query) {
        setQuery(input);
        log('search_performed', { query: input, timestamp: new Date().toISOString() });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [input, query, log]);
  
  const { products, loading, loadingMore, refreshing, error, loadMore, refresh, retry } = useProducts(query);
  
  return <View style={styles.screen}>
    <View style={styles.searchWrap}><Text style={styles.searchIcon}>⌕</Text><TextInput value={input} onChangeText={setInput} placeholder="Search products" returnKeyType="search" style={styles.search} accessibilityLabel="Search products" /></View>
    {error && <View style={styles.notice}><Text style={styles.noticeText}>{error}</Text><TouchableOpacity onPress={retry}><Text style={styles.retry}>Retry</Text></TouchableOpacity></View>}
    {loading ? <View style={styles.center}><ActivityIndicator color="#a05537" /><Text style={styles.subtle}>Finding products…</Text></View> : <FlatList
      data={products} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => <ProductCard item={item} onPress={() => onOpenProduct(item)} />}
      contentContainerStyle={products.length ? styles.list : styles.emptyList} onEndReached={loadMore} onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#a05537" />}
      ListEmptyComponent={<View style={styles.center}><Text style={styles.emptyTitle}>No matching products</Text><Text style={styles.subtle}>Try a different search.</Text></View>}
      ListFooterComponent={loadingMore ? <ActivityIndicator style={styles.footer} color="#a05537" /> : null}
    />}
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fffdf9' }, searchWrap: { margin: 16, height: 46, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', borderRadius: 13, backgroundColor: '#f2ede7' }, searchIcon: { marginRight: 8, fontSize: 25, color: '#736960' }, search: { flex: 1, fontSize: 16, color: '#2b2622' },
  list: { paddingHorizontal: 16, paddingBottom: 26 }, card: { height: 116, marginBottom: 12, padding: 10, flexDirection: 'row', borderRadius: 16, backgroundColor: 'white', shadowColor: '#4c372b', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 }, thumbnail: { width: 96, height: 96, borderRadius: 11, backgroundColor: '#f0ece7' }, cardText: { flex: 1, padding: 6, justifyContent: 'space-between' }, productTitle: { color: '#2b2622', fontSize: 16, fontWeight: '700' }, category: { color: '#81766d', fontSize: 13, textTransform: 'capitalize' }, price: { color: '#a05537', fontSize: 17, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 }, subtle: { marginTop: 9, color: '#81766d' }, emptyTitle: { fontSize: 18, fontWeight: '700', color: '#2b2622' }, emptyList: { flexGrow: 1 }, footer: { marginVertical: 18 }, notice: { marginHorizontal: 16, marginBottom: 8, padding: 10, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff1df' }, noticeText: { flex: 1, color: '#744c26', fontSize: 12 }, retry: { marginLeft: 12, color: '#a05537', fontWeight: '800' }
});
