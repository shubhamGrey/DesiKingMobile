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
import { colors, spacing, fontSize, borderRadius, shadows } from '../config/theme';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const AddressBookScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

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
          <Ionicons name="location" size={12} color={colors.primary.main} />
          <Text style={styles.badgeText}>Saved Location</Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={colors.error.main} />
        </TouchableOpacity>
      </View>

      <Text style={styles.fullName}>{user?.firstName} {user?.lastName}</Text>
      <Text style={styles.fullAddress}>{item.fullAddress}</Text>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="My Locations" showBack />

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator color={colors.primary.main} /></View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyCircle}><Ionicons name="map-outline" size={40} color={colors.text.disabled} /></View>
              <Text style={styles.emptyTitle}>No locations saved</Text>
              <Text style={styles.emptySubtitle}>Add your shipping address for a faster checkout.</Text>
            </View>
          }
        />
      )}

      <View style={styles.floatingFooter}>
        <Button title="+ Add New Location" onPress={() => {}} fullWidth style={styles.addBtn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  listContent: { padding: spacing.md, paddingBottom: 120 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background.muted, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: '800', color: colors.primary.main, textTransform: 'uppercase', marginLeft: 4 },
  deleteBtn: { padding: 4 },
  fullName: { fontSize: 16, fontWeight: 'bold', color: colors.text.primary, marginBottom: 4 },
  fullAddress: { fontSize: 14, color: colors.text.secondary, lineHeight: 20 },
  cardFooter: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#f9f9f9' },
  editBtn: { alignSelf: 'flex-start' },
  editBtnText: { fontSize: 13, color: colors.secondary.main, fontWeight: '700' },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.background.muted, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text.primary },
  emptySubtitle: { fontSize: 14, color: colors.text.secondary, textAlign: 'center', marginTop: 5, paddingHorizontal: 40 },
  floatingFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, ...shadows.dark },
  addBtn: { height: 56 },
});

export default AddressBookScreen;
