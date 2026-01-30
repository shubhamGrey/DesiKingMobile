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
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: elevation,
  },
  shadowOpacity: 0.1 + elevation * 0.02,
  shadowRadius: elevation * 1.5,
  elevation: elevation,
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
});

export default Card;
