import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, endpoints } from '../config/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async getAuthHeader() {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return {};
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const authHeader = options.includeAuth !== false ? await this.getAuthHeader() : {};
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...options.headers,
      },
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    return this.request(endpoints.login, {
      method: 'POST',
      body: credentials,
      includeAuth: false,
    });
  }

  async register(userData) {
    return this.request(endpoints.register, {
      method: 'POST',
      body: userData,
      includeAuth: false,
    });
  }

  async getUserProfile() {
    return this.request(endpoints.userProfile);
  }

  // Products
  async getProducts() {
    return this.request(endpoints.products, { includeAuth: false });
  }

  async getProductById(id) {
    return this.request(endpoints.productById(id), { includeAuth: false });
  }

  // Categories
  async getCategories() {
    return this.request(endpoints.categories, { includeAuth: false });
  }

  // Cart
  async getCart(userId) {
    return this.request(endpoints.cartByUser(userId));
  }

  async addToCart(cartItem) {
    return this.request(endpoints.cart, {
      method: 'POST',
      body: cartItem,
    });
  }

  async removeFromCart(cartItemId) {
    return this.request(`${endpoints.cart}/${cartItemId}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async createOrder(orderData) {
    return this.request(endpoints.createRazorpayOrder, {
      method: 'POST',
      body: orderData,
    });
  }

  // Contact
  async sendContactMessage(data) {
    return this.request(endpoints.contact, {
      method: 'POST',
      body: data,
      includeAuth: false,
    });
  }
}

export const apiService = new ApiService();
export default apiService;
