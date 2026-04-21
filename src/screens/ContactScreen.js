import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  Linking,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { colors, spacing, fontSize, borderRadius, fonts } from '../config/theme';
import apiService from '../services/api';

const contactDetails = [
  { icon: 'mail-outline', label: 'care@agronexis.com', action: () => Linking.openURL('mailto:care@agronexis.com') },
  { icon: 'call-outline', label: '+91 95820 00963', action: () => Linking.openURL('tel:+919582000963') },
  { icon: 'location-outline', label: 'Plot 29G/1, Kaushik Building, Mehrauli, New Delhi 110030', action: null },
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
      setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.default} />
      <Header title="Contact Us" showBack />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Info banner */}
          <ImageBackground
            source={require('../../assets/Dark Spice Illustration.png')}
            style={styles.infoSection}
            imageStyle={styles.infoBgImage}
            resizeMode="cover"
          >
            <View style={styles.infoOverlay}>
              <Image
                source={require('../../assets/AgroNexisWhite.png')}
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
                  activeOpacity={item.action ? 0.7 : 1}
                >
                  <View style={styles.contactIconCircle}>
                    <Ionicons name={item.icon} size={18} color={colors.secondary.main} />
                  </View>
                  <Text style={styles.contactLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}

              <View style={styles.socialContainer}>
                {socialMedia.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.socialButton}
                    onPress={() => Linking.openURL(item.url)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name={item.icon} size={22} color="#fff" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ImageBackground>

          {/* Contact Form */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Send us a Message</Text>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Input label="First Name" value={firstName} onChangeText={setFirstName} placeholder="First name" error={errors.firstName} />
              </View>
              <View style={styles.halfInput}>
                <Input label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Last name" error={errors.lastName} />
              </View>
            </View>

            <Input label="Email" value={email} onChangeText={setEmail} placeholder="Your email" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
            <Input label="Phone (Optional)" value={phone} onChangeText={setPhone} placeholder="Your phone number" keyboardType="phone-pad" />
            <Input label="Message" value={message} onChangeText={setMessage} placeholder="Write your message here..." multiline numberOfLines={4} error={errors.message} />

            <Button title="Send Message" onPress={handleSubmit} loading={isSubmitting} fullWidth style={styles.submitButton} />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },

  infoSection: {
    overflow: 'hidden',
  },
  infoBgImage: {
    opacity: 1,
  },
  infoOverlay: {
//    backgroundColor: 'rgba(20,56,43,0.82)',
    padding: spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201,151,90,0.25)',
  },
  logo: { width: 130, height: 80, marginBottom: spacing.md },
  infoTitle: {
    fontSize: fontSize.lg,
    fontFamily: fonts.heading.bold,
    color: '#FFFFFF',
    marginBottom: spacing.lg,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  contactIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(188,129,65,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(188,129,65,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  contactLabel: { fontSize: 13, color: 'rgba(255,255,255,0.85)', flex: 1, lineHeight: 18 },
  socialContainer: { flexDirection: 'row', marginTop: spacing.lg },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xs,
  },

  formSection: { padding: spacing.lg },
  formTitle: {
    fontSize: fontSize.xl,
    fontFamily: fonts.heading.bold,
    color: colors.secondary.light,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  row: { flexDirection: 'row', marginHorizontal: -spacing.xs },
  halfInput: { flex: 1, marginHorizontal: spacing.xs },
  submitButton: { marginTop: spacing.md },
});

export default ContactScreen;
