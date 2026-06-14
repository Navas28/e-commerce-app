import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { removeFromFavourites, selectFavouriteItems } from '../redux/slices/favouritesSlice';
import { addToBag, selectBagCount } from '../redux/slices/bagSlice';
import { Product } from '../redux/types';
import { Colors, FontFamily } from '../constants/theme';
import EmptyState from '../components/EmptyState';

export default function FavouritesScreen() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectFavouriteItems);
  const bagCount = useAppSelector(selectBagCount);
  const bagItems = useAppSelector(state => state.bag.items);

  const isEmpty = items.length === 0;

  const isInBag = (product: Product) =>
    bagItems.some(item => item.id === product.id);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favourites</Text>
        <TouchableOpacity onPress={() => router.push('/bag')} activeOpacity={0.7}>
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

      {isEmpty ? (
        <EmptyState
          icon="heart-outline"
          title="No favourites yet"
          subtitle="Tap the heart icon on any product to save it here."
          buttonLabel="Browse Products"
          onPress={() => router.push('/')}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
              activeOpacity={0.95}
            >
              <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color="#F5A623" />
                  <Text style={styles.rating}>{item.rating.rate.toFixed(1)}</Text>
                </View>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity
                  style={[styles.addBtn, isInBag(item) && styles.addBtnAdded]}
                  onPress={() => dispatch(addToBag(item))}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addBtnText}>{isInBag(item) ? 'Added' : 'Add to Bag'}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => dispatch(removeFromFavourites(item.id))}
                activeOpacity={0.7}
              >
                <Ionicons name="heart" size={22} color={Colors.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontFamily: FontFamily.regular,
    fontSize: 18,
    color: Colors.text,
    fontWeight: '700',
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
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  rating: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.text,
  },
  price: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  addBtnAdded: {
    backgroundColor: '#A0A0A0',
  },
  addBtnText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.white,
  },
  removeBtn: {
    padding: 4,
    alignSelf: 'flex-start',
  },
});
