import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { colors, spacing, fontSize, borderRadius, fonts, shadows } from '../config/theme';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const ManageAddressScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { address } = route.params || {};
  const isEditing = !!address;

  const parseAddressString = (fullAddr) => {
    if (!fullAddr) return {};
    const parts = fullAddr.split(',').map(p => p.trim());
    if (parts.length < 4) return { addressLine: fullAddr };
    const lastPart = parts[parts.length - 1];
    const pinSplit = lastPart.split('-').map(p => p.trim());
    return {
      pinCode: pinSplit[1] || '',
      countryName: pinSplit[0] || '',
      stateName: parts[parts.length - 2],
      city: parts[parts.length - 3],
      addressLine: parts.slice(0, parts.length - 3).join(', ')
    };
  };

  const parsed = isEditing && !address.addressLine ? parseAddressString(address.fullAddress) : {};

  const [formData, setFormData] = useState({
    fullName: address?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    addressLine: address?.addressLine || parsed.addressLine || '',
    city: address?.city || parsed.city || '',
    stateCode: address?.stateCode || '',
    countryCode: address?.countryCode || 'IN',
    pinCode: address?.pinCode || parsed.pinCode || '',
    phoneNumber: address?.phoneNumber || user?.phoneNumber || '',
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoadingDropdowns(true);
      const countryRes = await apiService.getCountries();
      const countriesList = countryRes.data || countryRes || [];
      setCountries(Array.isArray(countriesList) ? countriesList : []);

      let currentCountryCode = formData.countryCode;
      if (isEditing && parsed.countryName) {
        const foundCountry = countriesList.find(c =>
          (c.name || c.countryName)?.toLowerCase() === parsed.countryName.toLowerCase()
        );
        if (foundCountry) {
          currentCountryCode = foundCountry.code || foundCountry.countryCode;
          setFormData(prev => ({ ...prev, countryCode: currentCountryCode }));
        }
      }

      if (currentCountryCode) {
        const stateRes = await apiService.getStates(currentCountryCode);
        const statesList = stateRes.data || stateRes || [];
        setStates(Array.isArray(statesList) ? statesList : []);

        if (isEditing && parsed.stateName) {
          const foundState = statesList.find(s =>
            (s.name || s.stateName)?.toLowerCase() === parsed.stateName.toLowerCase()
          );
          if (foundState) {
            setFormData(prev => ({ ...prev, stateCode: foundState.code || foundState.stateCode }));
          }
        }
      }
    } catch (e) {
      console.error('Error fetching dropdown data:', e);
    } finally {
      setLoadingDropdowns(false);
    }
  };

  const fetchStates = async (countryCode) => {
    try {
      const response = await apiService.getStates(countryCode);
      const data = response.data || response || [];
      setStates(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching states:', e);
    }
  };

  const handleCountrySelect = (country) => {
    const code = country.code || country.countryCode;
    setFormData({ ...formData, countryCode: code, stateCode: '' });
    fetchStates(code);
    setShowCountryModal(false);
  };

  const handleStateSelect = (state) => {
    const code = state.code || state.stateCode;
    setFormData({ ...formData, stateCode: code });
    setShowStateModal(false);
  };

  const handleSave = async () => {
    const { fullName, addressLine, city, stateCode, countryCode, pinCode, phoneNumber } = formData;
    if (!fullName || !addressLine || !city || !stateCode || !countryCode || !pinCode || !phoneNumber) {
      Alert.alert('Missing Info', 'Please fill in all the required fields.');
      return;
    }
    try {
      setIsSaving(true);
      const addressPayload = {
        userId: user.id,
        fullName,
        phoneNumber,
        addressLine,
        city,
        stateCode,
        countryCode,
        pinCode,
        addressType: 'SHIPPING'
      };
      if (isEditing) addressPayload.id = address.id;
      await apiService.addAddress(addressPayload);
      Alert.alert('Success', isEditing ? 'Address updated successfully!' : 'New location added!');
      navigation.goBack();
    } catch (e) {
      console.error('Error saving address:', e);
      Alert.alert('Error', 'Failed to save address.');
    } finally {
      setIsSaving(false);
    }
  };

  const Selector = ({ label, value, onPress, placeholder }) => (
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selector} onPress={onPress} activeOpacity={0.8}>
        <Text style={[styles.selectorText, !value && styles.selectorPlaceholder]}>
          {value || placeholder}
        </Text>
        {loadingDropdowns ? (
          <ActivityIndicator size="small" color={colors.secondary.main} />
        ) : (
          <Ionicons name="chevron-down" size={18} color={colors.text.muted} />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.default} />
      <Header title={isEditing ? 'Edit Location' : 'Add New Location'} showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formCard}>

          <Text style={styles.label}>Receiver's Name</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(val) => setFormData({ ...formData, fullName: val })}
            placeholder="John Doe"
            placeholderTextColor={colors.text.disabled}
          />

          <Text style={styles.label}>Address Line (House No, Street)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.addressLine}
            onChangeText={(val) => setFormData({ ...formData, addressLine: val })}
            placeholder="e.g. 123, Purity Lane"
            placeholderTextColor={colors.text.disabled}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={formData.city}
            onChangeText={(val) => setFormData({ ...formData, city: val })}
            placeholder="e.g. Pune"
            placeholderTextColor={colors.text.disabled}
          />

          <View style={styles.row}>
            <Selector
              label="State"
              value={states.find(s => (s.code || s.stateCode) === formData.stateCode)?.name || states.find(s => (s.code || s.stateCode) === formData.stateCode)?.stateName}
              onPress={() => setShowStateModal(true)}
              placeholder="Select State"
            />
          </View>

          <View style={styles.row}>
            <Selector
              label="Country"
              value={countries.find(c => (c.code || c.countryCode) === formData.countryCode)?.name || countries.find(c => (c.code || c.countryCode) === formData.countryCode)?.countryName}
              onPress={() => setShowCountryModal(true)}
              placeholder="Select Country"
            />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput
                style={styles.input}
                value={formData.pinCode}
                onChangeText={(val) => setFormData({ ...formData, pinCode: val })}
                placeholder="411014"
                placeholderTextColor={colors.text.disabled}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            <View style={{ width: spacing.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(val) => setFormData({ ...formData, phoneNumber: val })}
                placeholder="Mobile number"
                placeholderTextColor={colors.text.disabled}
                keyboardType="phone-pad"
              />
            </View>
          </View>

        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title={isSaving ? 'Saving...' : 'Save Address'} onPress={handleSave} fullWidth loading={isSaving} />
      </View>

      {/* Country Modal */}
      <Modal visible={showCountryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Country</Text>
            {countries.length > 0 ? (
              <FlatList
                data={countries}
                keyExtractor={(item, index) => (item.code || item.countryCode || index).toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => handleCountrySelect(item)}>
                    <Text style={styles.modalItemText}>{item.name || item.countryName}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: colors.text.muted }}>Loading countries...</Text>
                <ActivityIndicator size="large" color={colors.secondary.main} style={{ marginTop: 10 }} />
              </View>
            )}
            <View style={{ marginTop: 10 }}>
              <Button title="Close" variant="secondary" onPress={() => setShowCountryModal(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* State Modal */}
      <Modal visible={showStateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select State</Text>
            {states.length > 0 ? (
              <FlatList
                data={states}
                keyExtractor={(item, index) => (item.code || item.stateCode || index).toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => handleStateSelect(item)}>
                    <Text style={styles.modalItemText}>{item.name || item.stateName}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: colors.text.muted }}>No states available.</Text>
              </View>
            )}
            <View style={{ marginTop: 10 }}>
              <Button title="Close" variant="secondary" onPress={() => setShowStateModal(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  scrollContent: { padding: spacing.md, paddingBottom: 120 },

  formCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.card.border,
    ...shadows.card,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.body.bold,
    color: colors.text.muted,
    marginBottom: 8,
    marginTop: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: colors.background.cream,
    borderRadius: borderRadius.md,
    padding: 13,
    fontSize: 14,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.card.border,
    fontFamily: fonts.body.regular,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  selector: {
    backgroundColor: colors.background.cream,
    borderRadius: borderRadius.md,
    padding: 13,
    borderWidth: 1,
    borderColor: colors.card.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: { fontSize: 14, color: colors.text.primary, fontFamily: fonts.body.regular },
  selectorPlaceholder: { color: colors.text.disabled },
  row: { flexDirection: 'row' },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 36 : spacing.lg,
    backgroundColor: colors.background.paper,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(188,129,65,0.25)',
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: colors.background.paper,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.lg,
    maxHeight: '80%',
    borderTopWidth: 1,
    borderTopColor: colors.card.border,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.heading.bold,
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text.primary,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalItemText: { fontSize: 15, color: colors.text.secondary, fontFamily: fonts.body.regular },
});

export default ManageAddressScreen;
