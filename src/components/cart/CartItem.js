import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, shadows, fonts } from '../../config/theme';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const hasDiscount = item.originalPrice && item.originalPrice > item.price;

  return (
    <View style={styles.container}>
      {/* Product image */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/80' }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeBtn}>
            <Ionicons name="trash-outline" size={16} color={colors.text.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
          )}
        </View>

        <View style={styles.bottomRow}>
          {/* Quantity stepper */}
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepBtn, item.quantity <= 1 && styles.stepBtnDisabled]}
              onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
            >
              <Ionicons name="remove" size={14} color={item.quantity <= 1 ? colors.text.disabled : colors.primary.main} />
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Ionicons name="add" size={14} color={colors.primary.main} />
            </TouchableOpacity>
          </View>

          <Text style={styles.total}>₹{(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.card.border,
    ...shadows.card,
  },
  imageWrap: {
    width: 76,
    height: 76,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.cream,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.card.border,
  },
  image: {
    width: '85%',
    height: '85%',
  },
  details: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  name: {
    flex: 1,
    fontSize: fontSize.sm,
    fontFamily: fonts.heading.bold,
    color: colors.text.primary,
    lineHeight: 19,
    marginRight: spacing.sm,
  },
  removeBtn: {
    padding: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  price: {
    fontSize: 13,
    fontFamily: fonts.heading.bold,
    color: colors.secondary.light,
  },
  originalPrice: {
    fontSize: 11,
    fontFamily: fonts.body.regular,
    color: colors.text.disabled,
    textDecorationLine: 'line-through',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.cream,
    borderRadius: borderRadius.full,
    paddingHorizontal: 4,
    paddingVertical: 3,
    gap: 2,
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.5,
  },
  qty: {
    fontSize: 13,
    fontFamily: fonts.body.extrabold,
    color: colors.text.primary,
    paddingHorizontal: 10,
    minWidth: 28,
    textAlign: 'center',
  },
  total: {
    fontSize: 15,
    fontFamily: fonts.heading.black,
    color: colors.secondary.light,
  },
});

export default CartItem;
