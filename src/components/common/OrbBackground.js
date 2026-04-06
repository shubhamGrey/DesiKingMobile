import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * orbs: array of orb config objects:
 *   { color: string, size: number, top?, bottom?, left?, right?, opacity?: number }
 *
 * Pre-built screen configs exported as ORB_CONFIGS.
 */
const OrbBackground = ({ orbs = [] }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {orbs.map((orb, i) => (
      <View
        key={i}
        style={[
          styles.orb,
          {
            width: orb.size,
            height: orb.size,
            borderRadius: orb.size / 2,
            backgroundColor: orb.color,
            opacity: orb.opacity ?? 1,
            top: orb.top,
            bottom: orb.bottom,
            left: orb.left,
            right: orb.right,
          },
        ]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
  },
});

export const ORB_CONFIGS = {
  home: [
    { color: 'rgba(31,79,64,0.55)',    size: 280, top: -80,  right: -80,  opacity: 1 },
    { color: 'rgba(188,129,65,0.35)',  size: 220, bottom: 80, left: -60,  opacity: 1 },
  ],
  products: [
    { color: 'rgba(232,93,4,0.25)',    size: 240, top: 40,   left: -60,   opacity: 1 },
    { color: 'rgba(188,129,65,0.30)',  size: 200, bottom: 120, right: -50, opacity: 1 },
  ],
  cart: [
    { color: 'rgba(188,129,65,0.28)',  size: 200, top: -50,  right: -50,  opacity: 1 },
    { color: 'rgba(31,79,64,0.35)',    size: 180, bottom: 100, left: -40, opacity: 1 },
  ],
  profile: [
    { color: 'rgba(31,79,64,0.45)',    size: 260, top: -60,  left: -60,   opacity: 1 },
    { color: 'rgba(188,129,65,0.25)',  size: 180, bottom: 80, right: -40, opacity: 1 },
  ],
  login: [
    { color: 'rgba(31,79,64,0.60)',    size: 300, top: -80,  left: '20%', opacity: 1 },
    { color: 'rgba(188,129,65,0.40)',  size: 200, bottom: -50, right: '10%', opacity: 1 },
  ],
  detail: [
    { color: 'rgba(188,129,65,0.30)',  size: 220, top: -60,  right: -60,  opacity: 1 },
    { color: 'rgba(31,79,64,0.35)',    size: 180, bottom: 100, left: -40, opacity: 1 },
  ],
};

export default OrbBackground;
