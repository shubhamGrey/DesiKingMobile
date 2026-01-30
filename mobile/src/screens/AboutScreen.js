import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import { colors, spacing, fontSize, borderRadius } from '../config/theme';

const highlights = [
  { icon: 'leaf-outline', text: '100% Natural Ingredients' },
  { icon: 'restaurant-outline', text: 'Farm-to-Packet Freshness' },
  { icon: 'flask-outline', text: 'Lab-Tested for Quality' },
  { icon: 'location-outline', text: 'Sourced from Heart of India' },
];

const coreValues = [
  'Quality & Purity',
  'Building Brand & Trust',
  'Innovation & Product Development',
  'Special focus to specific needs',
];

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="About Us" showBack />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://www.agronexis.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAgroNexisWhite.2e4065d9.png&w=384&q=75' }}
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <Text style={styles.heroTitle}>AGRO NEXIS</Text>
          <Text style={styles.heroSubtitle}>
            Pure Spices, Pure Health
          </Text>
        </View>

        {/* Who We Are */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people-outline" size={24} color={colors.primary.main} />
            <Text style={styles.sectionTitle}>Who We Are</Text>
          </View>
          <Text style={styles.sectionText}>
            At AGRO NEXIS INDIA OVERSEAS PRIVATE LIMITED, we believe that great food starts with great ingredients. Founded with a mission to bring purity and authenticity back to Indian kitchens, we specialize in high-quality spice powders including Haldi (Turmeric), Red Chilli, Coriander, and Cumin.
          </Text>
          <Text style={styles.sectionText}>
            Our spices are hygienically processed using advanced grinding and packaging technologies to preserve their natural aroma, color, and taste. From sourcing directly from trusted farmers to delivering across domestic and global markets, we ensure every step reflects our commitment to quality and trust.
          </Text>
        </View>

        {/* Our Vision */}
        <View style={styles.cardSection}>
          <View style={styles.card}>
            <Ionicons name="eye-outline" size={32} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Our Vision</Text>
            <Text style={styles.cardText}>
              What sets us apart is our unwavering commitment to quality and customer satisfaction. We don't just sell spices—we deliver trust, tradition, health and the promise of unforgettable flavours.
            </Text>
          </View>

          <View style={styles.card}>
            <Ionicons name="rocket-outline" size={32} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Our Mission</Text>
            <Text style={styles.cardText}>
              Our mission is simple: to source the finest quality spices, process and blend them with unmatched precision, and make them available for global households in their purest form within affordable prices.
            </Text>
          </View>
        </View>

        {/* Core Values */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart-outline" size={24} color={colors.primary.main} />
            <Text style={styles.sectionTitle}>Core Values</Text>
          </View>
          {coreValues.map((value, index) => (
            <View key={index} style={styles.valueItem}>
              <View style={styles.valueBullet} />
              <Text style={styles.valueText}>{value}</Text>
            </View>
          ))}
        </View>

        {/* What Makes Us Special */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Makes Us Special</Text>
          <View style={styles.highlightsGrid}>
            {highlights.map((item, index) => (
              <View key={index} style={styles.highlightItem}>
                <View style={styles.highlightIcon}>
                  <Ionicons name={item.icon} size={24} color={colors.primary.main} />
                </View>
                <Text style={styles.highlightText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Company Info */}
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>
            AGRO NEXIS INDIA OVERSEAS PRIVATE LIMITED
          </Text>
          <Text style={styles.cinNumber}>
            CIN No. - U47211DL2025PTC445306
          </Text>
          <Text style={styles.foundedYear}>Founded in 2025</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  heroSection: {
    backgroundColor: colors.primary.main,
    padding: spacing.xl,
    alignItems: 'center',
  },
  heroLogo: {
    width: 100,
    height: 100,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.primary.contrastText,
  },
  heroSubtitle: {
    fontSize: fontSize.lg,
    color: colors.primary.contrastText,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary.main,
    marginLeft: spacing.sm,
  },
  sectionText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.md,
    textAlign: 'justify',
  },
  cardSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary.main,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.primary.main,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  cardText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  valueBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.main,
    marginRight: spacing.md,
  },
  valueText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  highlightItem: {
    width: '50%',
    alignItems: 'center',
    padding: spacing.md,
  },
  highlightIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff3e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  highlightText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    textAlign: 'center',
  },
  companyInfo: {
    backgroundColor: colors.primary.main,
    padding: spacing.xl,
    alignItems: 'center',
  },
  companyName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary.contrastText,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  cinNumber: {
    fontSize: fontSize.sm,
    color: colors.primary.contrastText,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  foundedYear: {
    fontSize: fontSize.sm,
    color: colors.primary.contrastText,
    opacity: 0.8,
  },
});

export default AboutScreen;
