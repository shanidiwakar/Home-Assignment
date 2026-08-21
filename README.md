# Nua Products - React Native Home-Assignment

A focused product browser built with Expo and React Native. It uses DummyJSON's paginated product endpoints, supports debounced API-backed search, a persisted cart, product details, and a return-policy WebView.

## Run it

```bash
npm install
npm start
```

Then scan the Expo QR code with Expo Go, or press `i` / `a` for an iOS or Android simulator.

Run the race-condition test with:

```bash
npm test
```

## Included

- Server pagination with `skip` / `limit`, infinite scrolling, and pull-to-refresh.
- A 400 ms debounced `/products/search` request. Requests are aborted when superseded, and a monotonic request id prevents a late response from replacing the latest search result.
- Product image carousel, price calculation from `discountPercentage`, stock and rating details.
- Cart via Context API, persisted with AsyncStorage. Context suits this small shared state without Redux/Zustand boilerplate.
- Cached first product page as a lightweight offline fallback; failed API requests retry three times with exponential backoff.
- WebView return policy and console/in-memory analytics events: `product_viewed`, `add_to_cart`, `search_performed`, and `app_backgrounded`.
