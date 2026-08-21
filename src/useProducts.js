import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchProducts, readCachedProducts, withRetry } from './api';

const PAGE_SIZE = 12;

export function useProducts(query) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const requestId = useRef(0);
  const activeController = useRef(null);

  const loadFirstPage = useCallback(async ({ refresh = false } = {}) => {
    const id = ++requestId.current;
    activeController.current?.abort();
    const controller = new AbortController();
    activeController.current = controller;
    setError(null); refresh ? setRefreshing(true) : setLoading(true);
    try {
      const result = await withRetry(() => fetchProducts({ query, limit: PAGE_SIZE, signal: controller.signal }));
      // Ignore stale responses: a slow prior search can never overwrite a newer query.
      if (id !== requestId.current) return;
      setProducts(result.products); setTotal(result.total);
    } catch (caught) {
      if (caught.name === 'AbortError' || id !== requestId.current) return;
      const cache = !query ? await readCachedProducts() : null;
      if (cache && id === requestId.current) { setProducts(cache.products); setTotal(cache.total); setError('Showing your last saved products while offline.'); }
      else if (id === requestId.current) setError(caught.message);
    } finally {
      if (id === requestId.current) { setLoading(false); setRefreshing(false); }
    }
  }, [query]);

  useEffect(() => { loadFirstPage(); return () => activeController.current?.abort(); }, [loadFirstPage]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || products.length >= total) return;
    const id = requestId.current;
    setLoadingMore(true);
    try {
      const result = await withRetry(() => fetchProducts({ query, skip: products.length, limit: PAGE_SIZE }));
      if (id === requestId.current) setProducts((current) => [...current, ...result.products]);
    } catch (caught) { if (id === requestId.current) setError(caught.message); }
    finally { if (id === requestId.current) setLoadingMore(false); }
  }, [loading, loadingMore, products.length, query, total]);

  return { products, loading, loadingMore, refreshing, error, loadMore, refresh: () => loadFirstPage({ refresh: true }), retry: loadFirstPage };
}
