import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import Header from '../components/common/Header';
import { colors, spacing, fontSize, borderRadius, fonts, shadows } from '../config/theme';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = (width * 9) / 16;

const specialFeatures = [
  { icon: 'people-outline', title: '100% Natural Ingredients' },
  { icon: 'restaurant-outline', title: 'Farm-to-Pocket Freshness' },
  { icon: 'flask-outline', title: 'Lab-Tested for Quality' },
  { icon: 'location-outline', title: 'Sourced from Heart of India' },
];

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.default} />
      <Header title="About Us" showBack />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Video Section */}
        <View style={styles.videoContainer}>
          <WebView
            style={styles.video}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            allowsFullscreenVideo={true}
            mixedContentMode="always"
            userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36"
            source={{ uri: 'https://www.youtube.com/embed/tYRz6M819nE?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0' }}
          />
        </View>

        {/* Who We Are */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Who we are</Text>
          <View style={styles.subHeadingRow}>
            <Ionicons name="body-outline" size={22} color={colors.secondary.main} />
            <Text style={styles.subHeading}>Our Roots</Text>
          </View>
          <View style={styles.rootsContent}>
            <Text style={styles.paragraph}>
              At AGRO NEXIS INDIA OVERSEAS PRIVATE LIMITED, we believe that great food starts with great ingredients. Founded with a mission to bring purity and authenticity back to Indian kitchens, we specialize in high-quality spice powders including Haldi (Turmeric), Red Chilli, Coriander, and Cumin.
            </Text>
            <Image source={require('../../assets/DesiKing.png')} style={styles.rootsImage} resizeMode="contain" />
          </View>
          <Text style={styles.paragraph}>
            Our spices are hygienically processed using advanced grinding and packaging technologies to preserve their natural aroma, color, and taste. From sourcing directly from trusted farmers to delivering across domestic and global markets, we ensure every step reflects our commitment to quality and trust.
          </Text>
          <Text style={styles.paragraph}>
            We aim to bridge traditional Indian flavor with modern food standards, offering home cooks, chefs, retailers, and international buyers a product that's not just flavorful—but consistently reliable.
          </Text>
          <Text style={[styles.paragraph, { fontFamily: fonts.heading.bold, color: colors.secondary.light }]}>
            At AGRO NEXIS, we don't just sell spices. We deliver flavor, heritage, and health in every pinch.
          </Text>
        </View>

        {/* Vision, Values, Mission */}
        <View style={styles.cardSection}>
          <View style={styles.infoCard}>
            <View style={styles.cardIconCircle}>
              <Ionicons name="leaf-outline" size={24} color={colors.secondary.main} />
            </View>
            <Text style={styles.cardTitle}>Our Vision</Text>
            <Text style={styles.cardText}>
              What sets us apart is our unwavering commitment to quality and customer satisfaction. There will be more efforts to bring Organic Spices in coming future as we grow because we don't just sell spices—we deliver trust, tradition, health and the promise of unforgettable flavours.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.cardIconCircle}>
              <Ionicons name="diamond-outline" size={24} color={colors.secondary.main} />
            </View>
            <Text style={styles.cardTitle}>Core Values</Text>
            <View style={styles.valuesList}>
              {['Quality & Purity', 'Building Brand & Trust', 'Innovation & Product Development', 'Special focus to specific needs'].map((v, i) => (
                <View key={i} style={styles.valueItem}>
                  <View style={styles.valueDot} />
                  <Text style={styles.valueText}>{v}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.cardIconCircle}>
              <Ionicons name="flag-outline" size={24} color={colors.secondary.main} />
            </View>
            <Text style={styles.cardTitle}>Our Mission</Text>
            <Text style={styles.cardText}>
              Our mission is simple: to source the finest quality spices, process and blend them with unmatched precision, and make them available for global households in their purest form within affordable prices.
            </Text>
          </View>
        </View>

        {/* What Makes Us Special */}
        <View style={styles.specialSection}>
          <Text style={styles.sectionHeading}>What Makes Us Special</Text>
          <View style={styles.specialGrid}>
            {specialFeatures.map((item, index) => (
              <View key={index} style={styles.specialCard}>
                <Ionicons name={item.icon} size={24} color={colors.secondary.main} />
                <Text style={styles.specialCardTitle}>{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Behind the Brand */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Behind the Brand</Text>

          <View style={styles.founderCard}>
            <Image source={require('../../assets/Founder.jpg')} style={styles.founderThumb} />
            <View style={styles.founderInfo}>
              <Text style={styles.founderName}>Late. Shri Ram Prasad Sharma</Text>
              <Text style={styles.founderRole}>Founder</Text>
              <Text style={styles.founderBio}>
                Passionate about exploring the best spices without compromising quality. He always said "Pure Spices, Pure Health".
              </Text>
            </View>
          </View>

          <View style={styles.founderCard}>
            <Image source={require('../../assets/Co Founder.jpg')} style={styles.founderThumb} />
            <View style={styles.founderInfo}>
              <Text style={styles.founderName}>Shri Vijay Sharma</Text>
              <Text style={styles.founderRole}>CEO & Co-Founder</Text>
              <Text style={styles.founderBio}>
                Inspired by his father's ideology, he incepted Agro Nexis in 2025, blending a remarkable history and legacy with visionary growth.
              </Text>
            </View>
          </View>
        </View>

        {/* Our Team */}
        <View style={[styles.section, { marginBottom: spacing.xl }]}>
          <Text style={styles.sectionHeading}>Our Team</Text>
          <View style={styles.teamMember}>
            <Image source={require('../../assets/Co Founder.jpg')} style={styles.teamImage} />
            <Text style={styles.teamName}>Vijay Sharma</Text>
            <Text style={styles.teamRole}>CEO & Co-Founder</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerBranding}>
          <Text style={styles.footerBrandName}>AGRO NEXIS INDIA OVERSEAS PRIVATE LIMITED</Text>
          <Text style={styles.footerBrandSub}>© 2026 · Pure Spices, Pure Health</Text>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },

  videoContainer: { width, height: VIDEO_HEIGHT, backgroundColor: '#000' },
  video: { flex: 1 },

  section: { padding: spacing.lg },
  sectionHeading: {
    fontSize: 22,
    fontFamily: fonts.heading.bold,
    color: colors.secondary.light,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  subHeadingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  subHeading: {
    fontSize: 18,
    fontFamily: fonts.body.semibold,
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },
  rootsContent: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  rootsImage: { width: 100, height: 100, marginLeft: spacing.sm },
  paragraph: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.md,
    textAlign: 'justify',
  },

  cardSection: { padding: spacing.md },
  infoCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.card.border,
    ...shadows.card,
  },
  cardIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(188,129,65,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(188,129,65,0.2)',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fonts.heading.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  cardText: { fontSize: 13, color: colors.text.secondary, textAlign: 'center', lineHeight: 20 },
  valuesList: { width: '100%' },
  valueItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  valueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary.main,
    marginRight: 10,
  },
  valueText: { fontSize: 13, color: colors.text.secondary },

  specialSection: { padding: spacing.lg },
  specialGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  specialCard: {
    width: '48%',
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.card.border,
    ...shadows.card,
  },
  specialCardTitle: {
    fontSize: 12,
    fontFamily: fonts.body.semibold,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },

  founderCard: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.card.border,
    ...shadows.card,
  },
  founderThumb: { width: 72, height: 90, borderRadius: borderRadius.sm, marginRight: spacing.md },
  founderInfo: { flex: 1 },
  founderName: { fontSize: 14, fontFamily: fonts.heading.bold, color: colors.text.primary, marginBottom: 2 },
  founderRole: { fontSize: 11, fontFamily: fonts.body.bold, color: colors.secondary.main, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  founderBio: { fontSize: 12, color: colors.text.secondary, lineHeight: 18 },

  teamMember: { alignItems: 'center', padding: spacing.lg },
  teamImage: { width: 110, height: 110, borderRadius: 55, marginBottom: spacing.sm, borderWidth: 2, borderColor: 'rgba(188,129,65,0.4)' },
  teamName: { fontSize: 18, fontFamily: fonts.heading.bold, color: colors.text.primary },
  teamRole: { fontSize: 13, color: colors.secondary.main, marginTop: 2, fontFamily: fonts.body.medium },

  footerBranding: {
    backgroundColor: colors.primary.main,
    borderTopWidth: 1,
    borderTopColor: 'rgba(188,129,65,0.2)',
    padding: spacing.xl,
    alignItems: 'center',
  },
  footerBrandName: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontFamily: fonts.body.bold, textAlign: 'center' },
  footerBrandSub: { color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 4 },
});

export default AboutScreen;
