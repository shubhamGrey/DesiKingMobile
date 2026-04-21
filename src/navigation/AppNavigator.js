import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../config/theme';
import { useCart } from '../context/CartContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import AddressBookScreen from '../screens/AddressBookScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import ManageAddressScreen from '../screens/ManageAddressScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  { name: 'Home',     icon: 'home',        iconOutline: 'home-outline',     label: 'Home' },
  { name: 'Products', icon: 'grid',         iconOutline: 'grid-outline',     label: 'Shop' },
  { name: 'Cart',     icon: 'cart',         iconOutline: 'cart-outline',     label: 'Cart' },
  { name: 'Profile',  icon: 'person',       iconOutline: 'person-outline',   label: 'Profile' },
];

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { itemCount } = useCart();

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const cfg = TAB_CONFIG.find(t => t.name === route.name) || TAB_CONFIG[0];
        const isCart = route.name === 'Cart';

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tabItem}
            accessibilityLabel={cfg.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
          >
            <View style={styles.iconWrap}>
              <Ionicons
                name={focused ? cfg.icon : cfg.iconOutline}
                size={19}
                color={focused ? colors.primary.main : colors.text.disabled}
              />
              {isCart && itemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
              {cfg.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
  </Stack.Navigator>
);

const ProductsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProductsMain" component={ProductsScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
  </Stack.Navigator>
);

const CartStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CartMain" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
    <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    <Stack.Screen name="AddressBook" component={AddressBookScreen} />
    <Stack.Screen name="ManageAddress" component={ManageAddressScreen} />
    <Stack.Screen name="About" component={AboutScreen} />
    <Stack.Screen name="Contact" component={ContactScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Products" component={ProductsStack} />
    <Tab.Screen name="Cart" component={CartStack} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="AddressBook" component={AddressBookScreen} />
      <Stack.Screen name="ManageAddress" component={ManageAddressScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background.warm,
    borderTopWidth: 1.5,
    borderTopColor: colors.card.border,
    height: Platform.OS === 'ios' ? 78 : 58,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  iconWrap: {
    position: 'relative',
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: fonts.body.semibold,
    color: colors.text.disabled,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: colors.primary.main,
    fontFamily: fonts.body.extrabold,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontFamily: fonts.body.extrabold,
  },
});

export default AppNavigator;
