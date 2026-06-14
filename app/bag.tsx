import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  removeFromBag,
  selectBagItems,
  selectBagCount,
  selectBagTotal,
} from "../redux/slices/bagSlice";
import { selectFavouritesCount } from "../redux/slices/favouritesSlice";
import { Colors, FontFamily } from "../constants/theme";
import BagItem from "../components/BagItem";

export default function BagScreen() {
  const dispatch = useAppDispatch();
  const bagItems = useAppSelector(selectBagItems);
  const bagCount = useAppSelector(selectBagCount);
  const bagTotal = useAppSelector(selectBagTotal);

  const favouritesCount = useAppSelector(selectFavouritesCount);
  const isEmpty = bagItems.length === 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/")} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bag</Text>
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
      </View>

      {isEmpty ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <Image
            source={require("../assets/images/bag.png")}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>Your bag is empty</Text>
          <Text style={styles.emptySubtitle}>
            Looks like you haven't added anything yet.
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push("/")}
            activeOpacity={0.8}
          >
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Filled State */
        <>
          {/* Select All row */}
          <View style={styles.selectAllRow}>
            <Text style={styles.itemCount}>
              {bagCount} {bagCount === 1 ? "item" : "items"}
            </Text>
            <TouchableOpacity
              onPress={() =>
                bagItems.forEach((item) => dispatch(removeFromBag(item.id)))
              }
              activeOpacity={0.7}
            >
              <Text style={styles.removeAll}>Remove All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={bagItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <BagItem item={item} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Items</Text>
              <Text style={styles.totalValue}>{bagCount} {bagCount === 1 ? 'item' : 'items'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>${bagTotal.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.proceedBtn} activeOpacity={0.8}>
              <Text style={styles.proceedBtnText}>Proceed to Pay</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </>
      )}
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
  headerTitle: {
    fontFamily: FontFamily.regular,
    fontSize: 18,
    color: Colors.text,
    fontWeight: "700",
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -7,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontFamily: FontFamily.regular,
    fontWeight: '700',
  },

  /* Empty */
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: 24,
    opacity: 0.7,
  },
  emptyTitle: {
    fontFamily: FontFamily.regular,
    fontSize: 20,
    color: Colors.text,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    marginBottom: 32,
  },
  shopBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  shopBtnText: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: Colors.white,
    fontWeight: "600",
  },

  /* Filled */
  selectAllRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemCount: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: "#888888",
  },
  removeAll: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: "#E00",
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  /* Footer */
  footer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: "#888888",
  },
  totalValue: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text,
  },
  grandTotalLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: Colors.text,
    fontWeight: "700",
  },
  grandTotalValue: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
  },
  proceedBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  proceedBtnText: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: Colors.white,
    fontWeight: "700",
  },
});
