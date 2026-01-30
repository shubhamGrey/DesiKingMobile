# Agro Nexis Mobile App - PRD

## Project Overview
React Native cross-platform mobile app for Agro Nexis (www.agronexis.com) - India's premium spices e-commerce platform.

## Original Problem Statement
Create a mobile app for www.agronexis.com website with all features from the website, matching the existing design.

## User Choices
- **App Type**: React Native with Expo (cross-platform iOS & Android)
- **Features**: All website features
- **Design**: Match existing website design
- **Source**: Clone and analyze GitHub repo (https://github.com/shubhamGrey/DesiKing)

## User Personas
1. **End Consumer**: Shopping for premium Indian spices
2. **Returning Customer**: Managing orders and profile
3. **Guest User**: Browsing products without account

## Core Requirements (Static)
- [x] Home screen with featured products, categories, achievements
- [x] Products listing with category filtering
- [x] Product details with size selection
- [x] Cart functionality with quantity management
- [x] User authentication (login/register)
- [x] User profile management
- [x] About Us page
- [x] Contact Us page with form
- [x] Design matching website theme (#1f4f40 green, #FF8C00 orange)

## Architecture
- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State Management**: Context API (AuthContext, CartContext)
- **Storage**: AsyncStorage for local persistence
- **API**: REST API service layer connecting to Agro Nexis backend
- **Icons**: Ionicons (@expo/vector-icons)

## What's Been Implemented (Jan 30, 2026)

### Core Components
1. **Screens** (8 screens):
   - HomeScreen - Hero banner, achievements, featured products, categories
   - ProductsScreen - Product listing with category filters
   - ProductDetailsScreen - Full product view with SKU selection
   - CartScreen - Cart management with checkout flow
   - LoginScreen - Login/Register forms
   - ProfileScreen - User profile and settings
   - AboutScreen - Company info, vision, mission
   - ContactScreen - Contact form and company details

2. **Components**:
   - Common: Header, Button, Input, Card, Loading
   - Products: ProductCard, CategoryCard
   - Cart: CartItem

3. **Context Providers**:
   - AuthContext - Authentication state, login, logout
   - CartContext - Cart items, add/remove/update

4. **Services**:
   - API service layer with all endpoints configured

5. **Configuration**:
   - Theme matching website colors
   - API endpoints configuration

## Prioritized Backlog

### P0 (Critical)
- [x] All core screens implemented
- [x] Navigation setup complete
- [x] Context providers working
- [ ] Connect to actual Agro Nexis API (requires API URL update)

### P1 (High)
- [ ] Checkout flow with Razorpay integration
- [ ] Order history screen
- [ ] Address management screen
- [ ] Push notifications

### P2 (Medium)
- [ ] Product search functionality
- [ ] Wishlist feature
- [ ] Product reviews/ratings
- [ ] Order tracking

### P3 (Low)
- [ ] Social login (Google, Apple)
- [ ] App icon and splash screen with actual logo
- [ ] Deep linking support
- [ ] Analytics integration

## Next Tasks
1. Update API_BASE_URL in `/app/mobile/src/config/api.js` with actual API endpoint
2. Implement checkout flow with Razorpay payment
3. Add order history and tracking
4. Create custom app icons and splash screen
5. Test on iOS and Android devices

## How to Run

```bash
cd /app/mobile
npm install
npm start
```

Then scan QR code with Expo Go app on iOS/Android device.
