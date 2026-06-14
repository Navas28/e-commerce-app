import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setSortOption, clearSort, SortOption } from '../redux/slices/productsSlice';
import { Colors, FontFamily } from '../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating: High to Low', value: 'rating_desc' },
  { label: 'Best Sellers', value: 'best_sellers' },
];

export default function SortModal({ visible, onClose }: Props) {
  const dispatch = useAppDispatch();
  const currentSort = useAppSelector(state => state.products.sortOption);

  const handleSelect = (value: SortOption) => {
    dispatch(setSortOption(value));
    onClose();
  };

  const handleClear = () => {
    dispatch(clearSort());
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Sort by</Text>
          <View style={styles.headerRight}>
            {currentSort && (
              <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {SORT_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.label}
            style={styles.option}
            onPress={() => handleSelect(option.value)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.optionText,
              option.value === currentSort && styles.optionTextActive,
            ]}>
              {option.label}
            </Text>
            {option.value === currentSort && (
              <Ionicons name="checkmark" size={18} color={Colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 8,
  },
  title: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  optionText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text,
  },
  optionTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
