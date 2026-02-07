import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../config/theme';

const { width } = Dimensions.get('window');
const ITEM_SIZE = 100;

const CategoryCard = ({ category, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: category.imageUrl || category.image || 'https://via.placeholder.com/100' }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {category.name || category.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: ITEM_SIZE,
  },
  imageContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2, // Circular modern look
    backgroundColor: '#fff',
    padding: 2,
    borderWidth: 2,
    borderColor: colors.accent.cream,
    ...shadows.sm,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: ITEM_SIZE / 2,
  },
  title: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CategoryCard;
