import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { CheckCircle2, Droplets, Wheat, Leaf, Egg, Shell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userType, setUserType] = useState<'student' | 'family'>('student');
  const [allergies, setAllergies] = useState<string[]>(['Gluten Free']);
  const [budget, setBudget] = useState<'low' | 'medium' | 'high'>('low');

  const toggleAllergy = (a: string) => {
    setAllergies((prev) =>
      prev.includes(a) ? prev.filter((i) => i !== a) : [...prev, a]
    );
  };

  return (
    <View style={styles.container}>
      {/* Hero Visual Section */}
      <View style={styles.heroBackground}>
        <Image
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgViI_EaRSkNGviuDwB9O3Jvajd0Jgb9VVIEpyF2X3N1xkr9lYwd3_NVQ1HJtQ2W9Ywt6e8JhIZ4mDFOjolq1Q33-9AV8DSYCKEgBAVA7WQrw4R0sYD80vAldeFapPed-OdLRhExvRD6iZGEfPxJtegnFS7MwlLIzUqlKUF_ltWgE9VMZeqEki5z8fNdPv4HnLHYTWLWwaMzsDIuBeoekoIHafhMBbVCITq20YYqTSCSpQp1hfj_kzJEDUkMBPSTx8dMhJMzWGMD6t' }}
          style={styles.heroImage}
        />
        <View style={styles.gradientOverlay} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>

          {/* Header Content */}
          <View style={styles.headerBox}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>STEP 1 OF 3</Text>
            </View>
            <Text style={styles.title}>
              Personalize your <Text style={styles.titleItalic}>SmartEat</Text> experience.
            </Text>
          </View>

          {/* User Type Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Who are we feeding?</Text>
              <Text style={styles.sectionSubtitle}>Select one</Text>
            </View>

            <View style={styles.cardsRow}>
              {/* Option: Student */}
              <TouchableOpacity
                style={[
                  styles.typeCard,
                  userType === 'student' && styles.typeCardActive,
                ]}
                onPress={() => setUserType('student')}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.iconBox,
                    userType === 'student' && { backgroundColor: colors.primaryFixed },
                  ]}
                >
                  <Text style={[styles.iconEmoji, userType === 'student' && { opacity: 1 }]}>🎒</Text>
                </View>
                <Text style={styles.cardTitle}>Student</Text>
                <Text style={styles.cardDesc}>
                  Quick, budget-friendly meals for busy study sessions.
                </Text>
                {userType === 'student' && (
                  <View style={styles.checkIcon}>
                    <CheckCircle2 color={colors.primary} size={20} fill={colors.background} />
                  </View>
                )}
              </TouchableOpacity>

              {/* Option: Family */}
              <TouchableOpacity
                style={[
                  styles.typeCard,
                  userType === 'family' && styles.typeCardActive,
                ]}
                onPress={() => setUserType('family')}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.iconBox,
                    userType === 'family' && { backgroundColor: colors.primaryFixed },
                  ]}
                >
                  <Text style={[styles.iconEmoji, userType === 'family' && { opacity: 1 }]}>👨‍👩‍👧‍👦</Text>
                </View>
                <Text style={styles.cardTitle}>Family</Text>
                <Text style={styles.cardDesc}>
                  Wholesome, large-portion recipes for everyone to enjoy.
                </Text>
                {userType === 'family' && (
                  <View style={styles.checkIcon}>
                    <CheckCircle2 color={colors.primary} size={20} fill={colors.background} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Section: Allergies */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Any dietary restrictions?</Text>
              <Text style={styles.sectionSubtitle}>Select all that apply</Text>
            </View>

            <View style={styles.chipsWrap}>
              {[
                { name: 'Dairy Free', icon: <Droplets size={16} color={allergies.includes('Dairy Free') ? '#fff' : colors.onSurface} /> },
                { name: 'Gluten Free', icon: <Wheat size={16} color={allergies.includes('Gluten Free') ? '#fff' : colors.onSurface} /> },
                { name: 'Nut Free', icon: <Leaf size={16} color={allergies.includes('Nut Free') ? '#fff' : colors.onSurface} /> },
                { name: 'Egg Free', icon: <Egg size={16} color={allergies.includes('Egg Free') ? '#fff' : colors.onSurface} /> },
                { name: 'Shellfish', icon: <Shell size={16} color={allergies.includes('Shellfish') ? '#fff' : colors.onSurface} /> },
              ].map((item) => {
                const isActive = allergies.includes(item.name);
                return (
                  <TouchableOpacity
                    key={item.name}
                    style={[styles.chip, isActive && styles.chipActive]}
                    onPress={() => toggleAllergy(item.name)}
                    activeOpacity={0.7}
                  >
                    {item.icon}
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Section: Budget */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Weekly grocery budget</Text>
              <Text style={styles.sectionSubtitle}>Approximate</Text>
            </View>

            <View style={styles.budgetRow}>
              {[
                { id: 'low', title: 'Low', desc: 'Economy' },
                { id: 'medium', title: 'Medium', desc: 'Balanced' },
                { id: 'high', title: 'High', desc: 'Premium' },
              ].map((item) => {
                const isActive = budget === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.budgetBtn, isActive && styles.budgetBtnActive]}
                    onPress={() => setBudget(item.id as any)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.budgetTitle, isActive && styles.budgetTitleActive]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.budgetDesc, isActive && styles.budgetDescActive]}>
                      {item.desc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Sticky Bottom Action Area */}
          <View style={styles.bottomActions}>
            <TouchableOpacity 
              style={styles.continueBtn} 
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Main', { screen: 'Home' })}
            >
              <Text style={styles.continueBtnText}>Continue to Meals</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.skipBtn} 
              activeOpacity={0.6}
              onPress={() => navigation.navigate('Main', { screen: 'Home' })}
            >
              <Text style={styles.skipBtnText}>Maybe later, skip for now</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
    zIndex: 0,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.15, // Made it subtle
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(246, 246, 246, 0.5)', // Fade to match background
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: 40,
  },
  progressDot: {
    height: 6,
    width: 48,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
  },
  progressDotActive: {
    backgroundColor: colors.primaryFixed,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 48,
  },
  stepBadge: {
    backgroundColor: 'rgba(251, 180, 35, 0.3)', // tertiary-container/30
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  stepBadgeText: {
    color: colors.tertiary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.onSurface,
    textAlign: 'center',
    lineHeight: 44,
  },
  titleItalic: {
    color: colors.primary,
    fontStyle: 'italic',
    fontWeight: '900',
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.onSurface,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  typeCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.xl,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardActive: {
    borderColor: colors.primaryFixed,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,122,47,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconEmoji: {
    fontSize: 24,
    opacity: 0.7,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.onSurface,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  checkIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.full,
    gap: 8,
  },
  chipActive: {
    backgroundColor: colors.primaryFixed,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
  },
  chipTextActive: {
    color: '#fff',
  },
  budgetRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: 8,
    gap: 4,
  },
  budgetBtn: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  budgetBtnActive: {
    backgroundColor: colors.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
  },
  budgetTitleActive: {
    color: colors.onSurface,
  },
  budgetDesc: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  budgetDescActive: {
    color: colors.onSurfaceVariant, // stays gray but maybe darker
  },
  bottomActions: {
    alignItems: 'center',
    marginTop: 32,
    gap: spacing.xl,
  },
  continueBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  continueBtnText: {
    color: colors.onPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  skipBtn: {
    paddingVertical: 8,
  },
  skipBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
  },
});

export default OnboardingScreen;
