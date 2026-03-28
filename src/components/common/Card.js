import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius } from '../../config/theme';

const Card = ({ children, style, onPress, elevation = 2, testID }) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.card,
        elevation && { ...getShadowStyle(elevation) },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
      testID={testID}
    >
      {children}
    </Container>
  );
};

const getShadowStyle = (elevation) => ({
  shadowColor: '#1f4f40',
  shadowOffset: { width: 0, height: elevation * 1.5 },
  shadowOpacity: 0.06 + elevation * 0.015,
  shadowRadius: elevation * 2.5,
  elevation: elevation,
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.divider,
  },
});

export default Card;
