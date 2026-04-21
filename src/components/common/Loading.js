import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors, fontSize, fonts } from '../../config/theme';

const Loading = ({ size = 'large', text, fullScreen = false }) => {
  const lottie = (
    <LottieView
      source={require('../../../assets/lottie/leaf.json')}
      autoPlay
      loop
      style={styles.lottie}
    />
  );

  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        {lottie}
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {lottie}
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.default,
  },
  lottie: {
    width: 120,
    height: 120,
  },
  text: {
    marginTop: 8,
    fontSize: fontSize.sm,
    fontFamily: fonts.body.regular,
    color: colors.text.secondary,
  },
});

export default Loading;
