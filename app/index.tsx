import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchProducts,
  selectFilteredSortedProducts,
  selectHasActiveFilter,
} from "../redux/slices/productsSlice";
import { selectBagCount } from "../redux/slices/bagSlice";
import { selectFavouritesCount } from "../redux/slices/favouritesSlice";
import { Colors, FontFamily } from "../constants/theme";
import ProductCard from "../components/ProductCard";
import SortModal from "../components/SortModal";
import FilterModal from "../components/FilterModal";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProductsScreen() {
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector(selectFilteredSortedProducts);
  const status = useAppSelector((state) => state.products.status);
  const bagCount = useAppSelector(selectBagCount);
  const favouritesCount = useAppSelector(selectFavouritesCount);
  const hasFilter = useAppSelector(selectHasActiveFilter);
  const hasSort = useAppSelector((state) => !!state.products.sortOption);

  const [sortVisible, setSortVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const products = searchQuery.trim()
    ? allProducts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allProducts;

  const renderItem = useCallback(
    ({ item }: { item: (typeof allProducts)[0] }) => <ProductCard product={item} />,
    []
  );

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>T-shirts</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => { setSearchVisible(v => !v); setSearchQuery(''); }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={searchVisible ? 'close-outline' : 'search-outline'}
              size={24}
              color={searchVisible ? Colors.primary : Colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/favourites')} activeOpacity={0.7}>
            <View>
              <Ionicons name="heart-outline" size={24} color={Colors.text} />
              {favouritesCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{favouritesCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/bag")}
            activeOpacity={0.7}
          >
            <View>
              <Ionicons name="bag-outline" size={24} color={Colors.text} />
              {bagCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{bagCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      {searchVisible && (
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#AAAAAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color="#AAAAAA" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Sort & Filter toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolbarBtn}
          onPress={() => setSortVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="swap-vertical-outline"
            size={16}
            color={hasSort ? Colors.primary : Colors.text}
          />
          <Text
            style={[styles.toolbarText, hasSort && styles.toolbarTextActive]}
          >
            Sort by
          </Text>
          {hasSort && <View style={styles.activeDot} />}
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.toolbarBtn}
          onPress={() => setFilterVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="options-outline"
            size={16}
            color={hasFilter ? Colors.primary : Colors.text}
          />
          <Text
            style={[styles.toolbarText, hasFilter && styles.toolbarTextActive]}
          >
            Filters
          </Text>
          {hasFilter && <View style={styles.activeDot} />}
        </TouchableOpacity>
      </View>

      {status === "loading" && <LoadingSpinner />}

      {status === "failed" && (
        <EmptyState
          icon="cloud-offline-outline"
          title="Failed to load"
          subtitle="Check your connection and try again."
          buttonLabel="Retry"
          onPress={() => dispatch(fetchProducts())}
        />
      )}

      {status === "succeeded" && products.length === 0 && (
        <EmptyState
          icon="search-outline"
          title="No products found"
          subtitle={
            searchQuery
              ? `No results for "${searchQuery}"`
              : "Try adjusting your filters."
          }
        />
      )}

      {status === "succeeded" && products.length > 0 && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
      )}

      <SortModal visible={sortVisible} onClose={() => setSortVisible(false)} />
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  logoText: {
    fontFamily: FontFamily.regular,
    fontSize: 22,
    color: Colors.text,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -7,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontFamily: FontFamily.regular,
    fontWeight: "700",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    marginBottom: 8,
  },
  toolbarBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  toolbarText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text,
  },
  toolbarTextActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#E0E0E0",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 0,
  },
});
