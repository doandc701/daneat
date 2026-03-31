import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../services/supabase';

// ─── Design Tokens (The Digital Epicurean) ────────────────────────────────
const colors = {
  primary: '#9c3f00',
  primaryFixed: '#ff7a2f',
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
  errorLight: '#fff0ec',
};

// ─── Types ────────────────────────────────────────────────────────────────
type UserType = 'student' | 'family' | 'worker';
type BudgetLevel = 'low' | 'medium' | 'high';

const USER_TYPE_OPTIONS: { value: UserType; label: string; emoji: string; desc: string }[] = [
  { value: 'student', label: 'Sinh viên', emoji: '🎓', desc: 'Ngân sách thấp, ăn nhanh' },
  { value: 'family', label: 'Gia đình', emoji: '👨‍👩‍👧', desc: 'Nấu cho nhiều người' },
  { value: 'worker', label: 'Người đi làm', emoji: '💼', desc: 'Tiện lợi, healthy' },
];

const BUDGET_OPTIONS: { value: BudgetLevel; label: string; hint: string; color: string }[] = [
  { value: 'low', label: 'Tiết kiệm', hint: '< 50k/bữa', color: '#22c55e' },
  { value: 'medium', label: 'Vừa phải', hint: '50–150k/bữa', color: colors.primaryFixed },
  { value: 'high', label: 'Cao cấp', hint: '> 150k/bữa', color: '#8b5cf6' },
];

const QUICK_ALLERGIES = ['Hải sản', 'Đậu phộng', 'Gluten', 'Sữa', 'Trứng', 'Đậu nành'];
const QUICK_DISLIKES = ['Hành lá', 'Mắm tôm', 'Sầu riêng', 'Rau mùi', 'Đắng', 'Cay'];

// ─── Chip Component ───────────────────────────────────────────────────────
const Chip = ({
  label,
  active,
  onPress,
  onRemove,
  removable = false,
  accent = false,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  removable?: boolean;
  accent?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={[
      styles.chip,
      active && (accent ? styles.chipActiveAccent : styles.chipActive),
    ]}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    {removable && (
      <TouchableOpacity onPress={onRemove} hitSlop={8} style={styles.chipRemove}>
        <Text style={styles.chipRemoveText}>×</Text>
      </TouchableOpacity>
    )}
  </TouchableOpacity>
);

// ─── Section Header ───────────────────────────────────────────────────────
const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <View style={styles.sectionHeaderRow}>
    <View style={styles.sectionAccentBar} />
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────
const ProfileSettingsScreen = () => {
  const [saving, setSaving] = useState(false);
  const [userType, setUserType] = useState<UserType>('worker');
  const [budget, setBudget] = useState<BudgetLevel>('medium');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = useState('');
  const [customDislike, setCustomDislike] = useState('');

  // Load profile from Supabase
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('*').single();
        if (data && !error) {
          if (data.user_type) setUserType(data.user_type);
          if (data.budget) setBudget(data.budget);
          if (data.allergies) setAllergies(data.allergies);
        }
      } catch (_) {}
    };
    loadProfile();
  }, []);

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const addCustomItem = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    setValue: (v: string) => void
  ) => {
    const trimmed = value.trim();
    if (!trimmed || list.includes(trimmed)) return;
    setList([...list, trimmed]);
    setValue('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        user_type: userType,
        budget,
        allergies,
        dislikes,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      Toast.show({
        type: 'success',
        text1: 'Đã lưu! ✅',
        text2: 'Hồ sơ của bạn đã được cập nhật.',
        position: 'bottom',
      });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể lưu hồ sơ. Thử lại nhé!' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Page Header ── */}
        <View style={styles.pageHeader}>
          <Text style={styles.brandLabel}>SmartEat</Text>
          <Text style={styles.pageTitle}>Settings</Text>
          <Text style={styles.pageSubtitle}>Manage your culinary profile and preferences</Text>
        </View>

        {/* ════════════════════════════════ SECTION: PROFILE ══ */}
        <View style={styles.card}>
          <SectionHeader title="Profile" subtitle="Bạn là ai trong thế giới ẩm thực?" />

          <View style={styles.userTypeGrid}>
            {USER_TYPE_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.userTypeCard, userType === opt.value && styles.userTypeCardActive]}
                onPress={() => setUserType(opt.value)}
                activeOpacity={0.75}
              >
                <Text style={styles.userTypeEmoji}>{opt.emoji}</Text>
                <Text style={[styles.userTypeLabel, userType === opt.value && styles.userTypeLabelActive]}>
                  {opt.label}
                </Text>
                <Text style={styles.userTypeDesc}>{opt.desc}</Text>
                {userType === opt.value && <View style={styles.userTypeCheckDot} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ════════════════════════════════ SECTION: BLACKLIST ══ */}
        <View style={styles.card}>
          <SectionHeader
            title="Blacklist"
            subtitle="Items you never want to see in your meal plans"
          />

          {/* Strict Allergies */}
          <Text style={styles.subsectionLabel}>⚠️ Strict Allergies</Text>
          <Text style={styles.subsectionHint}>Các thành phần dị ứng — AI sẽ loại bỏ tuyệt đối</Text>
          <View style={styles.chipsRow}>
            {QUICK_ALLERGIES.map(item => (
              <Chip
                key={item}
                label={item}
                active={allergies.includes(item)}
                onPress={() => toggleItem(allergies, setAllergies, item)}
                accent
              />
            ))}
            {allergies
              .filter(a => !QUICK_ALLERGIES.includes(a))
              .map(item => (
                <Chip
                  key={item}
                  label={item}
                  active
                  removable
                  onRemove={() => setAllergies(allergies.filter(a => a !== item))}
                  accent
                />
              ))}
          </View>

          {/* Custom allergy input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Thêm dị ứng khác..."
              placeholderTextColor={colors.outlineVariant}
              value={customAllergy}
              onChangeText={setCustomAllergy}
              onSubmitEditing={() => addCustomItem(customAllergy, allergies, setAllergies, setCustomAllergy)}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addCustomItem(customAllergy, allergies, setAllergies, setCustomAllergy)}
            >
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.innerDivider} />

          {/* Disliked Ingredients */}
          <Text style={styles.subsectionLabel}>😤 Disliked Ingredients</Text>
          <Text style={styles.subsectionHint}>Các món bạn không thích — AI sẽ tránh nếu có thể</Text>
          <View style={styles.chipsRow}>
            {QUICK_DISLIKES.map(item => (
              <Chip
                key={item}
                label={item}
                active={dislikes.includes(item)}
                onPress={() => toggleItem(dislikes, setDislikes, item)}
              />
            ))}
            {dislikes
              .filter(d => !QUICK_DISLIKES.includes(d))
              .map(item => (
                <Chip
                  key={item}
                  label={item}
                  active
                  removable
                  onRemove={() => setDislikes(dislikes.filter(d => d !== item))}
                />
              ))}
          </View>

          {/* Custom dislike input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Thêm nguyên liệu không thích..."
              placeholderTextColor={colors.outlineVariant}
              value={customDislike}
              onChangeText={setCustomDislike}
              onSubmitEditing={() => addCustomItem(customDislike, dislikes, setDislikes, setCustomDislike)}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addCustomItem(customDislike, dislikes, setDislikes, setCustomDislike)}
            >
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ════════════════════════════════ SECTION: PREFERENCES ══ */}
        <View style={styles.card}>
          <SectionHeader title="Preferences" subtitle="Cấu hình gợi ý AI cho bạn" />

          <Text style={styles.subsectionLabel}>💰 Ngân sách mỗi bữa</Text>
          <View style={styles.budgetGrid}>
            {BUDGET_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.budgetCard,
                  budget === opt.value && { ...styles.budgetCardActive, borderColor: opt.color },
                ]}
                onPress={() => setBudget(opt.value)}
                activeOpacity={0.75}
              >
                <View style={[styles.budgetDot, { backgroundColor: opt.color }]} />
                <Text style={[styles.budgetLabel, budget === opt.value && { color: colors.onSurface, fontWeight: '800' }]}>
                  {opt.label}
                </Text>
                <Text style={styles.budgetHint}>{opt.hint}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Save Button ── */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.85}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
          )}
        </TouchableOpacity>

        {/* ── Summary Preview ── */}
        {(allergies.length > 0 || dislikes.length > 0) && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>📋 Tóm lược hồ sơ của bạn</Text>
            <Text style={styles.summaryLine}>
              👤 {USER_TYPE_OPTIONS.find(o => o.value === userType)?.label} ·{' '}
              {BUDGET_OPTIONS.find(o => o.value === budget)?.label}
            </Text>
            {allergies.length > 0 && (
              <Text style={styles.summaryLine}>⚠️ Dị ứng: {allergies.join(', ')}</Text>
            )}
            {dislikes.length > 0 && (
              <Text style={styles.summaryLine}>😤 Không thích: {dislikes.join(', ')}</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 60, gap: 16 },

  // Page Header
  pageHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  brandLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.primaryFixed,
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.onBackground,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 6,
    lineHeight: 20,
  },

  // Card
  card: {
    marginHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
    gap: 16,
  },

  // Section Header
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  sectionAccentBar: {
    width: 4,
    height: '100%',
    minHeight: 36,
    backgroundColor: colors.primaryFixed,
    borderRadius: 4,
    marginTop: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.onSurface, letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 13, color: colors.onSurfaceVariant, marginTop: 3, lineHeight: 18 },

  // Subsection
  subsectionLabel: { fontSize: 14, fontWeight: '800', color: colors.onSurface },
  subsectionHint: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: -10, lineHeight: 18 },
  innerDivider: { height: 1, backgroundColor: colors.surfaceContainer, marginVertical: 4 },

  // User Type Grid
  userTypeGrid: { flexDirection: 'row', gap: 10 },
  userTypeCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  userTypeCardActive: {
    borderColor: colors.primaryFixed,
    backgroundColor: '#fff5f0',
  },
  userTypeEmoji: { fontSize: 28, marginBottom: 4 },
  userTypeLabel: { fontSize: 13, fontWeight: '700', color: colors.onSurfaceVariant, textAlign: 'center' },
  userTypeLabelActive: { color: colors.primary },
  userTypeDesc: { fontSize: 10, color: colors.outline, textAlign: 'center', lineHeight: 14 },
  userTypeCheckDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryFixed,
  },

  // Chips
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 6,
  },
  chipActive: {
    backgroundColor: '#fff5f0',
    borderColor: colors.primaryFixed,
  },
  chipActiveAccent: {
    backgroundColor: colors.errorLight,
    borderColor: colors.error,
  },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.onSurfaceVariant },
  chipTextActive: { color: colors.primary, fontWeight: '700' },
  chipRemove: { marginLeft: 2 },
  chipRemoveText: { fontSize: 18, color: colors.outline, lineHeight: 20, marginTop: -1 },

  // Input
  inputRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.onSurface,
    fontWeight: '500',
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 24, fontWeight: '400', lineHeight: 30 },

  // Budget
  budgetGrid: { flexDirection: 'row', gap: 10 },
  budgetCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  budgetCardActive: { backgroundColor: '#fff5f0' },
  budgetDot: { width: 10, height: 10, borderRadius: 5 },
  budgetLabel: { fontSize: 13, fontWeight: '600', color: colors.onSurfaceVariant, textAlign: 'center' },
  budgetHint: { fontSize: 10, color: colors.outline, textAlign: 'center' },

  // Save Button
  saveBtn: {
    marginHorizontal: 16,
    height: 58,
    backgroundColor: colors.primary,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.3 },

  // Summary
  summaryCard: {
    marginHorizontal: 16,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 20,
    padding: 20,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.tertiaryContainer,
  },
  summaryTitle: { fontSize: 14, fontWeight: '800', color: colors.onSurface, marginBottom: 4 },
  summaryLine: { fontSize: 13, color: colors.onSurfaceVariant, lineHeight: 20 },
});

export default ProfileSettingsScreen;
