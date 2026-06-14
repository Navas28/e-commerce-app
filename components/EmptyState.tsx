import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily } from '../constants/theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  onPress?: () => void;
}

export default function EmptyState({ icon, title, subtitle, buttonLabel, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={80} color="#E0E0E0" />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {buttonLabel && onPress ? (
        <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.btnText}>{buttonLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontFamily: FontFamily.regular,
    fontSize: 20,
    color: Colors.text,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  btnText: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: Colors.white,
    fontWeight: '600',
  },
});
