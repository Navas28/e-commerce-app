import { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addToBag } from '../redux/slices/bagSlice';
import { toggleFavourite, selectIsFavourite } from '../redux/slices/favouritesSlice';
import { Product } from '../redux/types';
import { Colors, FontFamily } from '../constants/theme';

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();
  const isInBag = useAppSelector(state =>
    state.bag.items.some(item => item.id === product.id)
  );
  const isFavourite = useAppSelector(selectIsFavourite(product.id));

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
      activeOpacity={0.93}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        <TouchableOpacity
          style={styles.favouriteBtn}
          onPress={() => dispatch(toggleFavourite(product))}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavourite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavourite ? Colors.primary : Colors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#F5A623" />
          <Text style={styles.ratingText}>{product.rating.rate.toFixed(1)}</Text>
          <Text style={styles.ratingCount}>({product.rating.count})</Text>
        </View>

        <Text style={styles.price}>${product.price.toFixed(2)}</Text>

        <TouchableOpacity
          style={[styles.addBtn, isInBag && styles.addBtnAdded]}
          onPress={() => dispatch(addToBag(product))}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isInBag ? 'checkmark' : 'bag-add-outline'}
            size={13}
            color={Colors.white}
          />
          <Text style={styles.addBtnText}>{isInBag ? 'Added' : 'Add to Bag'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProductCard);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  imageContainer: {
    backgroundColor: '#F7F7F7',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
    padding: 8,
  },
  favouriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  info: {
    padding: 11,
  },
  title: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 18,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 6,
  },
  ratingText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.text,
    fontWeight: '600',
  },
  ratingCount: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#AAAAAA',
  },
  price: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  addBtnAdded: {
    backgroundColor: '#27AE60',
  },
  addBtnText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },
});
