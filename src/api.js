import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://dummyjson.com/products';
const CACHE_KEY = '@nua/product-cache';

export async function fetchProducts({ skip = 0, limit = 12, query = '', signal }) {
  const endpoint = query.trim()
    ? `${API_URL}/search?q=${encodeURIComponent(query.trim())}&skip=${skip}&limit=${limit}`
    : `${API_URL}?skip=${skip}&limit=${limit}`;
  const response = await fetch(endpoint, { signal });
  if (!response.ok) throw new Error(`Unable to load products (HTTP ${response.status})`);
  const result = await response.json();
  if (!query && skip === 0) AsyncStorage.setItem(CACHE_KEY, JSON.stringify(result)).catch(() => {});
  return result;
}

export async function readCachedProducts() {
  const value = await AsyncStorage.getItem(CACHE_KEY);
  return value ? JSON.parse(value) : null;
}

export async function withRetry(request, attempts = 3) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try { return await request(); }
    catch (error) {
      lastError = error;
      if (error.name === 'AbortError' || attempt === attempts - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
    }
  }
  throw lastError;
}
