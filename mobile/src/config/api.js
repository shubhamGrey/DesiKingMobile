// API configuration
// For production, set EXPO_PUBLIC_API_URL environment variable
// Falls back to agronexis.com API if not set
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://agronexis.com/api';

// API endpoints
export const endpoints = {
  // Auth
  login: '/auth/userLogin',
  register: '/auth/userRegistration',
  userProfile: '/auth/userProfile',
  
  // Products
  products: '/Product',
  productById: (id) => `/product/${id}`,
  
  // Categories
  categories: '/Category',
  
  // Cart
  cart: '/Cart',
  cartByUser: (userId) => `/Cart/${userId}`,
  
  // Orders
  orders: '/Order',
  orderById: (id) => `/Order/${id}`,
  
  // Addresses
  addresses: '/address',
  addressByUser: (userId) => `/address/user/${userId}`,
  
  // Common
  countries: '/Common/GetCountries',
  statesByCountry: (countryCode) => `/Common/GetStates/${countryCode}`,
  
  // Payment
  createRazorpayOrder: '/Order/createRazorpayOrder',
  verifyPayment: '/Payment/VerifyPayment',
  
  // Contact
  contact: '/contact',
};

export default {
  API_BASE_URL,
  endpoints,
};
