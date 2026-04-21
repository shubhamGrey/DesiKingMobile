import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import {
  Neuton_400Regular,
  Neuton_400Regular_Italic,
  Neuton_700Bold,
  Neuton_800ExtraBold,
} from '@expo-google-fonts/neuton';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    Neuton_400Regular,
    Neuton_400Regular_Italic,
    Neuton_700Bold,
    Neuton_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <CartProvider>
            <StatusBar style="light" backgroundColor="#1f4f40" />
            <AppNavigator />
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
