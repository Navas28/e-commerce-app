import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '../redux/hooks';
import { removeFromBag, increaseQuantity, decreaseQuantity } from '../redux/slices/bagSlice';
import { BagItem as BagItemType } from '../redux/types';
import { Colors, FontFamily } from '../constants/theme';

interface Props {
  item: BagItemType;
}

export default function BagItem({ item }: Props) {
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>

        <View style={styles.row}>
          <View style={styles.qtyControl}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => dispatch(decreaseQuantity(item.id))}
              activeOpacity={0.7}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => dispatch(increaseQuantity(item.id))}
              activeOpacity={0.7}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => dispatch(removeFromBag(item.id))}
            activeOpacity={0.7}
            style={styles.deleteBtn}
          >
            <Ionicons name="trash-outline" size={20} color="#E53935" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 84,
    height: 84,
  },
  details: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  qtyBtnText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '600',
    lineHeight: 22,
  },
  qty: {
    width: 38,
    textAlign: 'center',
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: 6,
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
  },
});
