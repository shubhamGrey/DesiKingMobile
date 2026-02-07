import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../config/theme';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const currencySymbol = '₹';
  const hasDiscount = item.originalPrice && item.originalPrice > item.price;

  return (
    <View style={styles.container} testID={`cart-item-${item.id}`}>
      {/* Delete button */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(item.id)}
      >
        <Ionicons name="close-circle" size={22} color={colors.text.muted} />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/80' }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {currencySymbol}{item.price}
            </Text>
            {hasDiscount && (
              <Text style={styles.originalPrice}>
                {currencySymbol}{item.originalPrice}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.bottomRow}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
            >
              <Ionicons name="remove" size={16} color={colors.text.primary} />
            </TouchableOpacity>

            <Text style={styles.quantity}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Ionicons name="add" size={16} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.totalPrice}>
            {currencySymbol}{(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
    height: 70,
  },
  infoSection: {
    paddingRight: 20,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  originalPrice: {
    fontSize: 11,
    color: colors.text.muted,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.lightGray,
    borderRadius: borderRadius.sm,
    padding: 2,
  },
  quantityButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 8,
    color: colors.text.primary,
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary.main,
  },
});

export default CartItem;
