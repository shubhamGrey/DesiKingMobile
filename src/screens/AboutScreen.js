import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import Header from '../components/common/Header';
import { colors, spacing, fontSize, borderRadius } from '../config/theme';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = (width * 9) / 16; // 16:9 Aspect Ratio

const specialFeatures = [
  { icon: 'people-outline', title: '100% Natural Ingredients', desc: '' },
  { icon: 'restaurant-outline', title: 'Farm-to-Pocket Freshness', desc: '' },
  { icon: 'flask-outline', title: 'Lab-Tested for Quality', desc: '' },
  { icon: 'location-outline', title: 'Sourced from Heart of India', desc: '' },
];

const AboutScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fffdf5' }}>
      <Header title="About Us" showBack />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

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
            // Adding userAgent can sometimes help trigger autoplay on certain Android versions
            userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36"
            source={{
              uri: 'https://www.youtube.com/embed/tYRz6M819nE?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0'
            }}
          />
        </View>

        {/* Who We Are Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Who we are</Text>
          <View style={styles.subHeadingRow}>
            <Ionicons name="body-outline" size={24} color={colors.primary.main} />
            <Text style={styles.subHeading}>Our Roots</Text>
          </View>

          <View style={styles.rootsContent}>
            <Text style={styles.paragraph}>
              At AGRO NEXIS INDIA OVERSEAS PRIVATE LIMITED, we believe that great food starts with great ingredients. Founded with a mission to bring purity and authenticity back to Indian kitchens, we specialize in high-quality spice powders including Haldi (Turmeric), Red Chilli, Coriander, and Cumin.
            </Text>

            <Image
              source={require('../../assets/DesiKing.png')}
              style={styles.rootsImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.paragraph}>
            Our spices are hygienically processed using advanced grinding and packaging technologies to preserve their natural aroma, color, and taste. From sourcing directly from trusted farmers to delivering across domestic and global markets, we ensure every step reflects our commitment to quality and trust.
          </Text>
          <Text style={styles.paragraph}>
            We aim to bridge traditional Indian flavor with modern food standards, offering home cooks, chefs, retailers, and international buyers a product that's not just flavorful—but consistently reliable.
          </Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold', color: colors.primary.main }]}>
            At AGRO NEXIS, we don't just sell spices. We deliver flavor, heritage, and health in every pinch.
          </Text>
        </View>

        {/* Vision, Values, Mission Cards */}
        <View style={styles.cardSection}>
          <View style={styles.infoCard}>
            <Ionicons name="leaf-outline" size={28} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Our Vision</Text>
            <Text style={styles.cardText}>
              What sets us apart is our unwavering commitment to quality and customer satisfaction. There will be more efforts to bring Organic Spices in coming future as we grow because we don't just sell spices—we deliver trust, tradition, health and the promise of unforgettable flavours. Let us be a part of our journey in creating Agro Nexis for Spices that bring people & culture together.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="diamond-outline" size={28} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Core Values</Text>
            <View style={styles.valuesList}>
              <Text style={styles.valueItem}>• Quality & Purity</Text>
              <Text style={styles.valueItem}>• Building Brand & Trust</Text>
              <Text style={styles.valueItem}>• Innovation & Product Development</Text>
              <Text style={styles.valueItem}>• Special focus to specific needs</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="flag-outline" size={28} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Our Mission</Text>
            <Text style={styles.cardText}>
              Our mission is simple: to source the finest quality spices, process and blend them with unmatched precision, and make them available for global households in their purest form within affordable prices. We believe that purity is the essence of great taste, and our products are crafted to preserve the natural richness and aroma of every ingredient.
            </Text>
          </View>
        </View>

        {/* What Makes Us Special */}
        <View style={styles.specialSection}>
          <Text style={styles.sectionHeading}>What Makes Us Special</Text>
          <View style={styles.specialGrid}>
            {specialFeatures.map((item, index) => (
              <View key={index} style={styles.specialCard}>
                <Ionicons name={item.icon} size={24} color={colors.primary.main} />
                <Text style={styles.specialCardTitle}>{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Behind the Brand */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Behind the Brand</Text>

          <View style={styles.founderContainer}>
            <Image source={require('../../assets/Founder.jpg')} style={styles.founderThumb} />
            <View style={styles.founderInfo}>
              <Text style={styles.founderName}>Late. Shri Ram Prasad Sharma (Founder)</Text>
              <Text style={styles.founderBio}>
                was passionate about exploring the best spices without compromising the quality and made them available for global households. He firmly believed that the taste of the foods comes from quality of spices, he always says "Pure Spices, Pure Health".
              </Text>
            </View>
          </View>

          <View style={styles.founderContainer}>
            <Image source={require('../../assets/Director.jpg')} style={styles.founderThumb} />
            <View style={styles.founderInfo}>
              <Text style={styles.founderName}>Shri Vijay Sharma</Text>
              <Text style={styles.founderBio}>
                With this ideology his youngest son Shri Vijay Sharma inspired to incept and develop a brand Agro Nexis in 2025 and started his spices journey with a limited resource. Ram Prasad was a great person and was admired by many for his foresight, words and wisdom. He successfully managed to balance his life between family and humanitarian duties.
              </Text>
            </View>
          </View>

          <Text style={[styles.paragraph, { marginTop: spacing.md }]}>
            "Agro Nexis India Overseas Private Limited" is a start-up business with a strong determination to be global one day with India and International presence. Incepted in the year 2025 by Shri Vijay Sharma, it is an inspiring and successful business inception that will blends a remarkable history and legacy with visionary growth and Innovation in near future. ANIOPL incepted with a pure heart to be always remained committed to create premium quality products and continues to build successful brands across many other processed food categories. A strong believes that the product range from the ANIOPL will be evolved magnificently over the years and its undeterred pursuit of "Quality & Innovation" which will lead consumer to the loyalty and satisfaction.
          </Text>
        </View>

        {/* Our Team Section */}
        <View style={[styles.section, { marginBottom: spacing.xl }]}>
          <Text style={styles.sectionHeading}>Our Team (The best team)</Text>
          <View style={styles.teamMember}>
            <Image source={require('../../assets/Co Founder.jpg')} style={styles.teamImage} />
            <Text style={styles.teamName}>Vijay Sharma</Text>
            <Text style={styles.teamRole}>CEO & Co-Founder</Text>
          </View>
        </View>

        {/* Footer Branding */}
        <View style={styles.footerBranding}>
          <Text style={styles.footerBrandName}>AGRO NEXIS INDIA OVERSEAS PRIVATE LIMITED</Text>
          <Text style={styles.footerBrandSub}>© 2026 | Pure Spices, Pure Health</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    width: width,
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  bannerContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 4,
  },
  bannerSubTitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary.main,
    textAlign: 'center',
    marginBottom: spacing.lg,
    textTransform: 'capitalize',
  },
  subHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary.main,
    marginLeft: spacing.xs,
  },
  rootsContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  rootsImage: {
    width: 120,
    height: 120,
    marginLeft: spacing.sm,
  },
  paragraph: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.md,
    textAlign: 'justify',
  },
  cardSection: {
    padding: spacing.md,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  cardText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  valuesList: {
    width: '100%',
    paddingHorizontal: spacing.md,
  },
  valueItem: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  specialSection: {
    padding: spacing.lg,
    backgroundColor: '#fff',
  },
  specialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specialCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#eee',
  },
  specialCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 8,
  },
  founderContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#eee',
  },
  founderThumb: {
    width: 80,
    height: 100,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  founderInfo: {
    flex: 1,
  },
  founderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  founderBio: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  teamMember: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  teamImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.sm,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  teamRole: {
    fontSize: 14,
    color: colors.primary.main,
    marginTop: 2,
  },
  footerBranding: {
    backgroundColor: colors.primary.main,
    padding: spacing.xl,
    alignItems: 'center',
  },
  footerBrandName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerBrandSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginTop: 4,
  },
});

export default AboutScreen;
