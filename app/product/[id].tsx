import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addToBag, selectBagCount } from '../../redux/slices/bagSlice';
import { toggleFavourite, selectIsFavourite } from '../../redux/slices/favouritesSlice';
import { Colors, FontFamily } from '../../constants/theme';
import EmptyState from '../../components/EmptyState';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const product = useAppSelector(state =>
    state.products.items.find(p => p.id === Number(id))
  );
  const isInBag = useAppSelector(state =>
    state.bag.items.some(item => item.id === Number(id))
  );
  const isFavourite = useAppSelector(selectIsFavourite(Number(id)));
  const bagCount = useAppSelector(selectBagCount);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Detail</Text>
          <View style={{ width: 24 }} />
        </View>
        <EmptyState
          icon="alert-circle-outline"
          title="Product not found"
          subtitle="This product may no longer be available."
          buttonLabel="Go Back"
          onPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Product Detail</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => product && dispatch(toggleFavourite(product))}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavourite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavourite ? Colors.primary : Colors.text}
            />
          </TouchableOpacity>
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
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        </View>

        {/* Category */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{product.title}</Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color="#F5A623" />
          <Text style={styles.ratingText}>
            {product.rating.rate.toFixed(1)}
          </Text>
          <Text style={styles.ratingCount}>({product.rating.count} reviews)</Text>
        </View>

        {/* Price */}
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>

        {/* Description */}
        <Text style={styles.descLabel}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>
      </ScrollView>

      {/* Sticky Add to Bag */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.addBtn, isInBag && styles.addBtnAdded]}
          onPress={() => dispatch(addToBag(product))}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isInBag ? 'checkmark-circle-outline' : 'bag-add-outline'}
            size={20}
            color={Colors.white}
          />
          <Text style={styles.addBtnText}>
            {isInBag ? 'Added to Bag' : 'Add to Bag'}
          </Text>
        </TouchableOpacity>
      </View>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
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
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  imageContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 260,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF0FF',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  categoryText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  title: {
    fontFamily: FontFamily.regular,
    fontSize: 18,
    color: Colors.text,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  ratingText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  ratingCount: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#888888',
  },
  price: {
    fontFamily: FontFamily.regular,
    fontSize: 24,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 20,
  },
  descLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: '#555555',
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addBtnAdded: {
    backgroundColor: '#A0A0A0',
  },
  addBtnText: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: Colors.white,
    fontWeight: '700',
  },
});
