import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../../config/theme';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const currencySymbol = '₹';

  return (
    <View style={styles.container} testID={`cart-item-${item.id}`}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/80' }}
        style={styles.image}
        resizeMode="contain"
      />
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text style={styles.price}>
          {currencySymbol}{item.price}
        </Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
            testID={`decrease-qty-${item.id}`}
          >
            <Ionicons name="remove" size={18} color={colors.text.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
            testID={`increase-qty-${item.id}`}
          >
            <Ionicons name="add" size={18} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={styles.totalPrice}>
          {currencySymbol}{(item.price * item.quantity).toFixed(2)}
        </Text>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(item.id)}
          testID={`remove-item-${item.id}`}
        >
          <Ionicons name="trash-outline" size={18} color={colors.error.main} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.sm,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text.primary,
  },
  price: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    padding: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  quantity: {
    fontSize: fontSize.md,
    fontWeight: '600',
    paddingHorizontal: spacing.sm,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  totalPrice: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  removeButton: {
    padding: spacing.xs,
  },
});

export default CartItem;
