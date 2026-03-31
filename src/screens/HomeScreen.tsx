import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { supabase } from '../services/supabase';

const { width } = Dimensions.get('window');

// ─── Design Tokens (from Stitch "The Digital Epicurean") ───────────────────
const colors = {
  primary: '#9c3f00',
  primaryFixed: '#ff7a2f',
  primaryContainer: '#ff7a2f',
  background: '#f6f6f6',
  surface: '#ffffff',
  surfaceContainer: '#e7e8e8',
  surfaceContainerLow: '#f0f1f1',
  surfaceContainerLowest: '#ffffff',
  onBackground: '#2d2f2f',
  onSurface: '#2d2f2f',
  onSurfaceVariant: '#5a5c5c',
  outline: '#767777',
  outlineVariant: '#acadad',
  tertiary: '#7a5400',
  tertiaryContainer: '#fbb423',
  error: '#b02500',
  errorContainer: '#f95630',
};

interface Meal {
  meal_name: string;
  reasoning: string;
  ingredients: string[];
  steps: string[];
}

// ─── Skeleton Component ────────────────────────────────────────────────────
const SkeletonPulse = ({ style }: { style: any }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 900, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return <Animated.View style={[{ backgroundColor: colors.surfaceContainer, borderRadius: 12, opacity }, style]} />;
};

const HomeScreenSkeleton = () => (
  <View style={styles.skeletonWrap}>
    <SkeletonPulse style={{ height: 220, borderRadius: 24, marginBottom: 24 }} />
    <SkeletonPulse style={{ height: 32, width: '80%', marginBottom: 10 }} />
    <SkeletonPulse style={{ height: 20, width: '60%', marginBottom: 24 }} />
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
      {[1, 2, 3, 4].map(i => (
        <SkeletonPulse key={i} style={{ height: 32, width: 80, borderRadius: 999 }} />
      ))}
    </View>
    <SkeletonPulse style={{ height: 16, marginBottom: 8 }} />
    <SkeletonPulse style={{ height: 16, width: '90%', marginBottom: 8 }} />
    <SkeletonPulse style={{ height: 16, width: '75%', marginBottom: 32 }} />
    <SkeletonPulse style={{ height: 56, borderRadius: 999 }} />
  </View>
);

// ─── Main Component ────────────────────────────────────────────────────────
const HomeScreen = () => {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(20)).current;

  const animateIn = () => {
    cardOpacity.setValue(0);
    cardTranslate.setValue(24);
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(cardTranslate, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  };

  const fetchSuggestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: functionError } = await supabase.functions.invoke('get-meal-suggestion', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      });

      if (functionError) throw functionError;
      setMeal(data);
      setTimeout(animateIn, 50);
    } catch (err: any) {
      console.error('--- DETAILED ERROR LOG ---');
      console.error('Name:', err.name);
      console.error('Message:', err.message);
      setError(err.message || 'Không thể lấy gợi ý. Thử lại sau nhé!');
      Toast.show({
        type: 'error',
        text1: 'Lỗi kết nối AI',
        text2: err.message || 'Kiểm tra terminal để biết chi tiết.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!meal) return;
    try {
      const { error: insertError } = await supabase.from('meal_history').insert([
        {
          meal_name: meal.meal_name,
          reasoning: meal.reasoning,
          ingredients: meal.ingredients,
          steps: meal.steps,
          created_at: new Date().toISOString(),
        },
      ]);
      if (insertError) throw insertError;
      Toast.show({
        type: 'success',
        text1: 'Đã lưu! 🎉',
        text2: `${meal.meal_name} vào lịch sử ăn của bạn.`,
        position: 'bottom',
      });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể lưu vào lịch sử.' });
    }
  };

  const handleRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    fetchSuggestion();
  };

  useEffect(() => {
    fetchSuggestion();
  }, []);

  const now = new Date();
  const timeLabel =
    now.getHours() < 10 ? 'Bữa sáng' : now.getHours() < 14 ? 'Bữa trưa' : now.getHours() < 18 ? 'Bữa xế' : 'Bữa tối';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandLabel}>SmartEat</Text>
            <Text style={styles.headlineTitle}>Your AI Curated Meal</Text>
          </View>
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>{timeLabel}</Text>
          </View>
        </View>

        {/* ── Section label ── */}
        <View style={styles.sectionLabel}>
          <View style={styles.accentLine} />
          <Text style={styles.sectionLabelText}>Today's Epicurean Pick</Text>
        </View>

        {/* ── Content ── */}
        {loading ? (
          <HomeScreenSkeleton />
        ) : error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Không thể kết nối AI</Text>
            <Text style={styles.errorSubtitle}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={handleRefresh}>
              <Text style={styles.retryBtnText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : meal ? (
          <Animated.View style={{ opacity: cardOpacity, transform: [{ translateY: cardTranslate }] }}>
            {/* ── Hero Meal Card ── */}
            <View style={styles.heroCard}>
              {/* Hero Banner */}
              <View style={styles.heroBanner}>
                <View style={styles.heroBannerInner}>
                  <Text style={styles.heroEmoji}>🍽️</Text>
                </View>
                <View style={styles.heroGradientOverlay} />
                <View style={styles.heroAiBadge}>
                  <Text style={styles.heroAiBadgeText}>✦ AI PICK</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                {/* Meal Name */}
                <Text style={styles.mealName}>{meal.meal_name}</Text>

                {/* Reasoning */}
                <View style={styles.reasoningRow}>
                  <Text style={styles.reasoningQuote}>"</Text>
                  <Text style={styles.reasoningText}>{meal.reasoning}</Text>
                </View>

                {/* Divider */}
                <View style={styles.dividerWrap}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerDot}>◆</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Ingredients */}
                <Text style={styles.sectionTitle}>Nguyên liệu</Text>
                <View style={styles.chipsRow}>
                  {meal.ingredients.map((item, i) => (
                    <View key={i} style={styles.chip}>
                      <Text style={styles.chipText}>{item}</Text>
                    </View>
                  ))}
                </View>

                {/* Steps */}
                <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Cách chế biến</Text>
                <View style={styles.stepsWrap}>
                  {meal.steps.map((step, i) => (
                    <View key={i} style={styles.stepRow}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeNum}>{i + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* ── Action Buttons ── */}
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
                  <Text style={styles.confirmBtnText}>Chốt đơn 🎉</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh} activeOpacity={0.7}>
                  <Text style={styles.refreshBtnText}>↺</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  brandLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.primaryFixed,
  },
  headlineTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.onBackground,
    marginTop: 2,
    letterSpacing: -0.5,
  },
  timeBadge: {
    backgroundColor: colors.tertiaryContainer,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 6,
  },
  timeBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.tertiary,
    letterSpacing: 0.5,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 16,
    gap: 10,
  },
  accentLine: {
    width: 4,
    height: 18,
    backgroundColor: colors.primaryFixed,
    borderRadius: 4,
  },
  sectionLabelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  skeletonWrap: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 24,
  },
  errorCard: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 40,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  heroCard: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 8,
  },
  heroBanner: {
    height: 200,
    backgroundColor: '#1a0a00',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroBannerInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,122,47,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 72,
  },
  heroGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(26,10,0,0.6)',
  },
  heroAiBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255,122,47,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  heroAiBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  cardBody: {
    padding: 28,
  },
  mealName: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.onSurface,
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 14,
  },
  reasoningRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  reasoningQuote: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primaryFixed,
    lineHeight: 28,
    marginRight: 6,
    marginTop: -4,
  },
  reasoningText: {
    flex: 1,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant,
    opacity: 0.4,
  },
  dividerDot: {
    fontSize: 8,
    color: colors.primaryFixed,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.tertiaryContainer,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.tertiary,
  },
  stepsWrap: {
    gap: 16,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepBadgeNum: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: colors.onSurface,
    lineHeight: 24,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 28,
    paddingBottom: 28,
  },
  confirmBtn: {
    flex: 1,
    height: 56,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  refreshBtn: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshBtnText: {
    fontSize: 26,
    color: colors.primary,
    fontWeight: '700',
    lineHeight: 30,
  },
});

export default HomeScreen;
