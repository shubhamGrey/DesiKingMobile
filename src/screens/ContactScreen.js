import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { colors, spacing, fontSize, borderRadius, fonts } from '../config/theme';
import apiService from '../services/api';

const contactDetails = [
  {
    icon: 'mail-outline',
    label: 'care@agronexis.com',
    action: () => Linking.openURL('mailto:care@agronexis.com'),
  },
  {
    icon: 'call-outline',
    label: '+91 95820 00963',
    action: () => Linking.openURL('tel:+919582000963'),
  },
  {
    icon: 'location-outline',
    label: 'Plot 29G/1, Kaushik Building, Mehrauli, New Delhi 110030',
    action: null,
  },
];

const socialMedia = [
  { icon: 'logo-instagram', url: 'https://www.instagram.com/agronexis/' },
  { icon: 'logo-youtube', url: 'https://www.youtube.com/@AgroNexisIndiaOverseasPrivateL' },
  { icon: 'logo-facebook', url: 'https://www.facebook.com/profile.php?id=61575821300609' },
  { icon: 'logo-linkedin', url: 'https://www.linkedin.com/in/aniopl' },
];

const ContactScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';
    if (!message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await apiService.sendContactMessage({
        action: 'sendEmail',
        name: `${firstName} ${lastName}`,
        email,
        message,
      });
      Alert.alert('Success', 'Your message has been sent successfully!');
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Contact Us" showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Contact Info Section */}
          <View style={styles.infoSection}>
            <Image
              source={{ uri: 'https://www.agronexis.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAgroNexisWhite.2e4065d9.png&w=384&q=75' }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.infoTitle}>Let's Get In Touch</Text>
            
            {contactDetails.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactItem}
                onPress={item.action}
                disabled={!item.action}
              >
                <Ionicons name={item.icon} size={20} color={colors.primary.contrastText} />
                <Text style={styles.contactLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            {/* Social Media */}
            <View style={styles.socialContainer}>
              {socialMedia.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.socialButton}
                  onPress={() => Linking.openURL(item.url)}
                >
                  <Ionicons name={item.icon} size={24} color={colors.primary.contrastText} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Contact Form */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Send us a Message</Text>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Input
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  error={errors.firstName}
                  testID="contact-firstname-input"
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  error={errors.lastName}
                  testID="contact-lastname-input"
                />
              </View>
            </View>

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              testID="contact-email-input"
            />

            <Input
              label="Phone (Optional)"
              value={phone}
              onChangeText={setPhone}
              placeholder="Your phone number"
              keyboardType="phone-pad"
              testID="contact-phone-input"
            />

            <Input
              label="Message"
              value={message}
              onChangeText={setMessage}
              placeholder="Write your message here..."
              multiline
              numberOfLines={4}
              error={errors.message}
              testID="contact-message-input"
            />

            <Button
              title="Send Message"
              onPress={handleSubmit}
              loading={isSubmitting}
              fullWidth
              style={styles.submitButton}
              testID="contact-submit-btn"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  keyboardView: {
    flex: 1,
  },
  infoSection: {
    backgroundColor: colors.primary.main,
    padding: spacing.xl,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.lg,
  },
  infoTitle: {
    fontSize: fontSize.xl,
    fontFamily: fonts.body.semibold,
    color: colors.primary.contrastText,
    marginBottom: spacing.lg,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  contactLabel: {
    fontSize: fontSize.md,
    color: colors.primary.contrastText,
    marginLeft: spacing.md,
    flex: 1,
  },
  socialContainer: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xs,
  },
  formSection: {
    padding: spacing.lg,
  },
  formTitle: {
    fontSize: fontSize.xl,
    fontFamily: fonts.heading.bold,
    color: colors.primary.main,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -spacing.xs,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});

export default ContactScreen;
