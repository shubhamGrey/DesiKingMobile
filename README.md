# Agro Nexis Mobile App

React Native mobile application for Agro Nexis - Premium Indian Spices E-commerce.

## Features

- **Home Screen**: Featured products, categories, achievements, and company highlights
- **Products**: Browse all products with category filtering
- **Product Details**: Detailed product view with size selection and add to cart
- **Cart**: Full cart management with quantity controls and checkout
- **User Authentication**: Login and registration
- **Profile**: User profile, orders, and settings
- **About**: Company information and values
- **Contact**: Contact form and company details

## Tech Stack

- React Native with Expo
- React Navigation (Bottom Tabs + Stack)
- Context API for state management (Auth, Cart)
- Async Storage for local persistence
- Ionicons for icons

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

```bash
# For iOS
npm run ios

# For Android
npm run android

# For Web
npm run web
```

## Project Structure

```
mobile/
├── App.js                    # Main app entry point
├── app.json                  # Expo configuration
├── package.json
├── assets/                   # Images, icons, splash
└── src/
    ├── components/
    │   ├── common/           # Shared components (Header, Button, Input, etc.)
    │   ├── products/         # Product-related components
    │   └── cart/             # Cart-related components
    ├── config/
    │   ├── theme.js          # Colors, spacing, typography
    │   └── api.js            # API configuration
    ├── context/
    │   ├── AuthContext.js    # Authentication state
    │   └── CartContext.js    # Cart state management
    ├── navigation/
    │   └── AppNavigator.js   # Navigation configuration
    ├── screens/
    │   ├── HomeScreen.js
    │   ├── ProductsScreen.js
    │   ├── ProductDetailsScreen.js
    │   ├── CartScreen.js
    │   ├── LoginScreen.js
    │   ├── ProfileScreen.js
    │   ├── AboutScreen.js
    │   └── ContactScreen.js
    └── services/
        └── api.js            # API service layer
```

## Color Theme

Matches the Agro Nexis website:
- Primary: #1f4f40 (Dark Green)
- Secondary: #FF8C00 (Orange)
- Background: #fffaf0 (Cream)
- Text: #555555

## API Integration

The app connects to the Agro Nexis API. Update the `API_BASE_URL` in `src/config/api.js` with your actual API endpoint.

## Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

## License

© 2026 Agro Nexis India Overseas Private Limited. All rights reserved.
