// API configuration
// Updated based on web app network calls: https://agronexis.com/app/...
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://agronexis.com/app';

// API endpoints
export const endpoints = {
  // Auth
  login: '/auth/userLogin',
  register: '/auth/userRegistration',
  userProfile: '/auth/userProfile',
  
  // Products
  products: '/product',
  productById: (id) => `/product/${id}`,
  
  // Categories
  categories: '/category',
  
  // Cart
  cart: '/cart',
  cartByUser: (userId) => `/cart/${userId}`,
  
  // Orders
  orders: '/checkout',
  orderById: (id) => `/checkout/${id}`,
  orderByUser: (userId) => `/checkout/user/${userId}`,
  
  // Addresses
  addresses: '/address',
  addressByUser: (userId) => `/address/${userId}`,
  
  // Common
  countries: '/common/GetCountries',
  statesByCountry: (countryCode) => `/common/GetStates/${countryCode}`,
  
  // Payment
  createRazorpayOrder: '/checkout/create-order',
  verifyPayment: '/Payment/VerifyPayment',
  
  // Contact
  contact: '/contact',
};

export default {
  API_BASE_URL,
  endpoints,
};
