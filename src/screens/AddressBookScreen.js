import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { colors, spacing, fontSize, borderRadius, fonts } from '../config/theme';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const AddressBookScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAddresses();
    });
    return unsubscribe;
  }, [navigation]);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      if (user?.id) {
        const response = await apiService.addressByUser(user.id);
        setAddresses(response.data || []);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (addressId) => {
    Alert.alert('Delete', 'Remove this location from your profile?', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiService.deleteAddress(addressId);
            setAddresses(addresses.filter(a => a.id !== addressId));
          } catch (e) {
            Alert.alert('Error', 'Failed to delete.');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.addressCard}>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Ionicons name="location" size={12} color={colors.secondary.main} />
          <Text style={styles.badgeText}>Saved Location</Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="trash-outline" size={18} color={colors.error.main} />
        </TouchableOpacity>
      </View>

      <Text style={styles.fullName}>{user?.firstName} {user?.lastName}</Text>
      <Text style={styles.fullAddress}>{item.fullAddress}</Text>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('ManageAddress', { address: item })}
        >
          <Ionicons name="create-outline" size={14} color={colors.secondary.main} style={{ marginRight: 4 }} />
          <Text style={styles.editBtnText}>Edit Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <Header title="My Locations" showBack />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.secondary.main} />
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyCircle}>
                <Ionicons name="map-outline" size={40} color={colors.text.muted} />
              </View>
              <Text style={styles.emptyTitle}>No locations saved</Text>
              <Text style={styles.emptySubtitle}>Add your shipping address for a faster checkout.</Text>
            </View>
          }
        />
      )}

      <View style={styles.floatingFooter}>
        <Button
          title="+ Add New Location"
          onPress={() => navigation.navigate('ManageAddress')}
          fullWidth
          style={styles.addBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  listContent: { padding: spacing.md, paddingBottom: 120 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  addressCard: {
    backgroundColor: colors.glass.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(188,129,65,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(188,129,65,0.2)',
  },
  badgeText: { fontSize: 10, fontFamily: fonts.body.extrabold, color: colors.secondary.light, textTransform: 'uppercase', marginLeft: 4 },
  deleteBtn: { padding: 4 },

  fullName: { fontSize: 15, fontFamily: fonts.heading.bold, color: colors.text.primary, marginBottom: 4 },
  fullAddress: { fontSize: 13, color: colors.text.secondary, lineHeight: 20 },

  cardFooter: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    flexDirection: 'row',
  },
  editBtn: { flexDirection: 'row', alignItems: 'center' },
  editBtnText: { fontSize: 13, color: colors.secondary.main, fontFamily: fonts.body.bold },

  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.glass.surface,
    borderWidth: 1,
    borderColor: colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontFamily: fonts.heading.bold, color: colors.text.primary },
  emptySubtitle: { fontSize: 13, color: colors.text.muted, textAlign: 'center', marginTop: 6, paddingHorizontal: 40, lineHeight: 20 },

  floatingFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: '#0d1e3d',
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(188,129,65,0.25)',
  },
  addBtn: { height: 52 },
});

export default AddressBookScreen;
