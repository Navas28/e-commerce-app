import { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setFilterCategory,
  setFilterPriceRange,
  clearFilters,
  PriceRange,
} from '../redux/slices/productsSlice';
import { Colors, FontFamily } from '../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const PRICE_OPTIONS: { label: string; value: PriceRange }[] = [
  { label: 'Under $20', value: 'under_20' },
  { label: '$20 – $100', value: '20_to_100' },
  { label: 'Above $100', value: 'above_100' },
];

const LEFT_FILTERS = ['Category', 'Price Range'];

export default function FilterModal({ visible, onClose }: Props) {
  const dispatch = useAppDispatch();

  const categories = useAppSelector(state =>
    [...new Set(state.products.items.map(p => p.category))]
  );
  const currentCategory = useAppSelector(state => state.products.filterCategory);
  const currentPriceRange = useAppSelector(state => state.products.filterPriceRange);

  const [activeFilter, setActiveFilter] = useState('Category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(currentCategory);
  const [selectedPrice, setSelectedPrice] = useState<PriceRange>(currentPriceRange);

  const handleApply = () => {
    dispatch(setFilterCategory(selectedCategory));
    dispatch(setFilterPriceRange(selectedPrice));
    onClose();
  };

  const handleClearAll = () => {
    setSelectedCategory(null);
    setSelectedPrice(null);
    dispatch(clearFilters());
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {/* Left panel */}
          <View style={styles.leftPanel}>
            {LEFT_FILTERS.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[styles.leftItem, activeFilter === filter && styles.leftItemActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[
                  styles.leftItemText,
                  activeFilter === filter && styles.leftItemTextActive,
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Right panel */}
          <ScrollView style={styles.rightPanel} showsVerticalScrollIndicator={false}>
            {activeFilter === 'Category' && categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={styles.rightItem}
                onPress={() => setSelectedCategory(prev => prev === cat ? null : cat)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.rightItemText,
                  selectedCategory === cat && styles.rightItemTextSelected,
                ]}>
                  {cat}
                </Text>
                {selectedCategory === cat && (
                  <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}

            {activeFilter === 'Price Range' && PRICE_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={styles.rightItem}
                onPress={() => setSelectedPrice(prev => prev === opt.value ? null : opt.value)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.rightItemText,
                  selectedPrice === opt.value && styles.rightItemTextSelected,
                ]}>
                  {opt.label}
                </Text>
                {selectedPrice === opt.value && (
                  <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
            <Text style={styles.clearBtnText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyBtnText}>Apply Filter</Text>
          </TouchableOpacity>
        </View>
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
    maxHeight: '70%',
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  body: {
    flexDirection: 'row',
    height: 240,
  },
  leftPanel: {
    width: '38%',
    backgroundColor: '#F7F7F7',
  },
  leftItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  leftItemActive: {
    backgroundColor: Colors.white,
    borderLeftColor: Colors.primary,
  },
  leftItemText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#888888',
  },
  leftItemTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  rightPanel: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  rightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  rightItemText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.text,
  },
  rightItemTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  clearBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  clearBtnText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  applyBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyBtnText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.white,
    fontWeight: '600',
  },
});
