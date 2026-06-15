# E-Commerce App

A React Native e-commerce application built with Expo SDK 54.

---

## Screenshots

<img width="717" height="1443" alt="WhatsApp Image 2026-06-14 at 1 26 03 PM (1)" src="https://github.com/user-attachments/assets/8e0a1264-0654-428a-a03c-842e6fa4953a" />
<img width="717" height="1528" alt="WhatsApp Image 2026-06-14 at 1 26 04 PM" src="https://github.com/user-attachments/assets/c7654f97-e471-4eb1-991a-c86256992444" />
<img width="717" height="1536" alt="WhatsApp Image 2026-06-14 at 1 26 04 PM (1)" src="https://github.com/user-attachments/assets/d94acf58-a3e9-4f61-bf4a-607634da3bc2" />
<img width="717" height="1536" alt="WhatsApp Image 2026-06-14 at 1 26 04 PM (2)" src="https://github.com/user-attachments/assets/915dc758-3f89-4878-b821-c5c5de4d78b4" />
<img width="717" height="1442" alt="WhatsApp Image 2026-06-14 at 1 26 03 PM" src="https://github.com/user-attachments/assets/fc6a462b-e47b-4632-8af7-d65cc2841be4" />
<img width="717" height="1545" alt="WhatsApp Image 2026-06-14 at 1 26 04 PM (3)" src="https://github.com/user-attachments/assets/90df19df-27c2-4bc6-a669-46f2ce9386b0" />

---

## Features

### Products Screen
- Fetches products from [FakeStore API](https://fakestoreapi.com/products)
- 2-column product grid with cards showing image, title, rating, and price
- Real-time search bar — filters products by name as you type
- **5 functional sort options:** Price Low→High, Price High→Low, Rating High→Low, Best Sellers, Newest
- **2 functional filters:** Category, Price Range (Under $20 / $20–$100 / Above $100)
- Active indicator dot on Sort and Filter buttons when applied
- Pull-to-refresh ready (retry on error)

### Product Detail Screen
- Full product view: image, category badge, title, star rating, price, description
- Add to Bag button (turns grey with checkmark when already added)
- Heart icon in header to toggle favourite
- Navigates via Expo Router dynamic route `/product/[id]`

### Bag Screen
- Add, remove, increase, and decrease item quantities
- Remove all items at once
- Empty state with illustration when bag is empty
- Grand total calculation
- Item count and total items in footer
- Proceed to Pay button (static UI)
- Bag persists after app close via AsyncStorage

### Favourites Screen
- Save any product as a favourite using the heart icon (on cards, detail page)
- Favourite count badge on the heart icon across all screens
- Add favourited products directly to bag from the favourites screen
- Tap any item to view its detail page
- Empty state when no favourites saved
- Favourites persist after app close via AsyncStorage

### Global UX
- Global `LoadingSpinner` component used across all loading states
- Global `EmptyState` component with icon, title, subtitle, and action button
- Error state with Retry button on the products screen
- No results state when search or filters return zero products
- League Spartan font throughout the app

---

## Tech Stack

| Category | Package | Version |
|----------|---------|---------|
| Framework | Expo | ~54.0.34 |
| Language | TypeScript | ~5.9.2 |
| Navigation | Expo Router | ~6.0.23 |
| State Management | Redux Toolkit | ^2.12.0 |
| React Redux | react-redux | ^9.3.0 |
| Persistence | redux-persist | ^6.0.0 |
| Storage | @react-native-async-storage/async-storage | 2.2.0 |
| Font | @expo-google-fonts/league-spartan | ^0.4.2 |
| Icons | @expo/vector-icons | ^15.0.3 |
| HTTP | fetch (built-in) | — |

---

## Project Structure

```
react-app/
├── app/
│   ├── _layout.tsx          # Root layout — Provider, PersistGate, Tabs
│   ├── index.tsx            # Products Screen
│   ├── bag.tsx              # Bag Screen
│   ├── favourites.tsx       # Favourites Screen
│   └── product/
│       └── [id].tsx         # Product Detail Screen (dynamic route)
│
├── components/
│   ├── ProductCard.tsx      # Grid card with heart toggle + Add to Bag
│   ├── BagItem.tsx          # Bag list item with quantity controls
│   ├── SortModal.tsx        # Bottom sheet sort options
│   ├── FilterModal.tsx      # Two-panel filter modal (category + price range)
│   ├── EmptyState.tsx       # Global reusable empty/error state
│   └── LoadingSpinner.tsx   # Global centered loading indicator
│
├── redux/
│   ├── store.ts             # Redux store with redux-persist config
│   ├── hooks.ts             # Typed useAppDispatch and useAppSelector
│   ├── types.ts             # Product and BagItem TypeScript interfaces
│   └── slices/
│       ├── productsSlice.ts # Fetch, sort, filter logic
│       ├── bagSlice.ts      # Cart CRUD actions and selectors
│       └── favouritesSlice.ts # Favourites toggle and selectors
│
├── constants/
│   └── theme.ts             # Colors and font family constants
│
├── assets/
│   └── images/
│       ├── icon.png         # App icon
│       ├── adaptive-icon.png# Android adaptive icon
│       ├── splash-icon.png  # Splash screen
│       ├── favicon.png      # Web favicon
│       ├── logo.png         # Header logo
│       └── bag.png          # Bag empty state illustration
│
├── metro.config.js          # Fixes redux-persist Metro bundler compatibility
└── app.json                 # Expo app configuration
```

---

## Redux Architecture

```
Store
├── products  (not persisted)
│   ├── items[]         — fetched from API
│   ├── status          — idle | loading | succeeded | failed
│   ├── sortOption      — price_asc | price_desc | rating_desc | best_sellers | newest
│   ├── filterCategory  — electronics | jewelery | men's clothing | women's clothing
│   └── filterPriceRange— under_20 | 20_to_100 | above_100
│
├── bag  (persisted)
│   └── items[]         — BagItem extends Product with quantity
│
└── favourites  (persisted)
    └── items[]         — Product[]
```

**Actions available:**
- `addToBag`, `removeFromBag`, `increaseQuantity`, `decreaseQuantity`
- `addToFavourites`, `removeFromFavourites`, `toggleFavourite`
- `setSortOption`, `setFilterCategory`, `setFilterPriceRange`, `clearFilters`, `clearSort`
- `fetchProducts` (async thunk)

---

## Setup & Run

### Prerequisites
- Node.js 18+
- Expo Go app installed on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Make sure your phone and computer are on the same Wi-Fi network

### Installation

```bash
# Clone the repository
git clone https://github.com/Navas28/e-commerce-app.git
cd e-commerce-app/react-app

# Install dependencies
npm install
```

### Running the App

```bash
# Start the development server
npx expo start
```

Then scan the QR code with:
- **Android** — Expo Go app
- **iPhone** — Camera app

### Run on specific platform

```bash
# Android emulator
npx expo start --android

# iOS simulator
npx expo start --ios
```

## API

Products are fetched from the public [FakeStore API](https://fakestoreapi.com):

```
GET https://fakestoreapi.com/products
```

No API key required. All sort and filter operations are performed client-side on the fetched data.

---

## Design

- **Font:** League Spartan 400 Regular
- **Primary color:** `#4342FF`
- **Text color:** `#29292C`
- **Background:** `#FFFFFF`
