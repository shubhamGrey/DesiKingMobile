import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../config/theme';

const ITEM_SIZE = 76;

const CategoryCard = ({ category, onPress, active = false }) => (
  <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.imageWrap, active && styles.imageWrapActive]}>
      <Image
        source={{ uri: category.imageUrl || category.image || 'https://via.placeholder.com/100' }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
    <Text style={[styles.title, active && styles.titleActive]} numberOfLines={1}>
      {category.name || category.title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: ITEM_SIZE + 10,
    marginRight: spacing.sm,
  },
  imageWrap: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: colors.background.paper,
    borderWidth: 2.5,
    borderColor: colors.divider,
    ...shadows.sm,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  imageWrapActive: {
    borderColor: colors.primary.main,
    ...shadows.light,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  titleActive: {
    color: colors.primary.main,
    fontWeight: '800',
  },
});

export default CategoryCard;
