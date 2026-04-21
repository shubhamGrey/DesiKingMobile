import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fonts } from '../../config/theme';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const hasDiscount = item.originalPrice && item.originalPrice > item.price;

  return (
    <View style={styles.container}>
      {/* Image */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cat} numberOfLines={1}>{item.categoryName || 'Spices'}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>₹{(item.price * item.quantity).toFixed(0)}</Text>

          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
            >
              <Text style={styles.stepTxt}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Text style={styles.stepTxt}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Remove */}
      <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.removeTxt}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.card.border,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 2,
  },
  imageWrap: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: colors.background.cream,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderWidth: 1,
    borderColor: colors.card.border,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: fonts.heading.bold,
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 19,
    marginBottom: 3,
  },
  cat: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.text.muted,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 17,
    color: colors.primary.main,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.cream,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.card.border,
    padding: 2,
  },
  stepBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTxt: {
    fontFamily: fonts.body.bold,
    fontSize: 16,
    color: colors.text.primary,
  },
  qty: {
    fontFamily: fonts.body.extrabold,
    fontSize: 13,
    color: colors.text.primary,
    paddingHorizontal: 10,
    minWidth: 28,
    textAlign: 'center',
  },
  removeBtn: {
    alignSelf: 'flex-start',
    padding: 4,
    marginLeft: 4,
  },
  removeTxt: {
    fontSize: 18,
    color: colors.text.disabled,
    lineHeight: 20,
  },
});

export default CartItem;
