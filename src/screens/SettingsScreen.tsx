import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Menu, User, Ban, X, Plus, Utensils, ChevronRight, List } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius } from '../theme/theme';
import { supabase } from '../services/supabase';
import Toast from 'react-native-toast-message';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const [experience, setExperience] = useState<'Novice' | 'Intermediate' | 'Chef'>('Intermediate');
  const [allergies, setAllergies] = useState<string[]>(['Peanuts', 'Shellfish']);
  const [dislikes, setDislikes] = useState<string[]>(['Coriander', 'Brussels Sprouts', 'Olives', 'Blue Cheese']);
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  const removeAllergy = (item: string) => {
    setAllergies(allergies.filter((a) => a !== item));
  };

  const removeDislike = (item: string) => {
    setDislikes(dislikes.filter((d) => d !== item));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* TopAppBar */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton}>
            <Menu size={24} color={colors.primaryFixed} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.brandText}>SmartEat</Text>
        </View>
        <TouchableOpacity style={styles.profileAvatar}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATLf9YXNpn5ZSMe-j98HIU1FtkvdTXV-AAI61J1pnoL0K2f2RMRffiKXhPE2a3abFKEFp48hDX-YPsIFJrgs1TqHO322_wxUyJXN69U6DNLXQEI84GFqjlKFNV-JDOysAzbyvnFfsQ4X3lMyVUoF5u1Y7y9xzDvp3rq8kiwQvqPO3st-XaZGe1jG5u7WM8SciDXFAG7LvdaEbiJAIRGdF_7aKTgzMGVQ_KR65Rq8jBl11y7QixgcfovI7W7hcxr3t0IKeVxr-REt05' }}
            style={styles.avatarImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Screen Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Settings</Text>
          <Text style={styles.pageSubtitle}>Manage your culinary profile and preferences</Text>
        </View>

        <View style={styles.sectionsContainer}>

          {/* Profile Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Profile</Text>
              <User size={24} color={colors.primary} fill={colors.primary} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <TextInput
                style={styles.inputField}
                defaultValue="Elena Rodriguez"
                placeholderTextColor={colors.onSurfaceVariant}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.inputField}
                defaultValue="elena.rod@example.com"
                keyboardType="email-address"
                placeholderTextColor={colors.onSurfaceVariant}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>COOKING EXPERIENCE</Text>
              <View style={styles.segmentedControl}>
                {(['Novice', 'Intermediate', 'Chef'] as const).map((level) => {
                  const isActive = experience === level;
                  return (
                    <TouchableOpacity
                      key={level}
                      style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                      onPress={() => setExperience(level)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Blacklist Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Blacklist</Text>
              <Ban size={24} color={colors.error} strokeWidth={2.5} />
            </View>
            <Text style={styles.cardDesc}>
              Items you never want to see in your meal plans
            </Text>

            {/* Strict Allergies */}
            <View style={styles.blacklistGroup}>
              <Text style={styles.inputLabel}>STRICT ALLERGIES</Text>
              <View style={styles.chipsRow}>
                {allergies.map((item) => (
                  <View key={item} style={styles.chipError}>
                    <Text style={styles.chipErrorText}>{item}</Text>
                    <TouchableOpacity onPress={() => removeAllergy(item)}>
                      <X size={14} color={colors.onErrorContainer} strokeWidth={3} />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.chipAddError} activeOpacity={0.7}>
                  <Plus size={14} color={colors.onSurfaceVariant} strokeWidth={3} />
                  <Text style={styles.chipAddText}>Add Allergy</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Disliked Ingredients */}
            <View style={styles.blacklistGroup}>
              <Text style={styles.inputLabel}>DISLIKED INGREDIENTS</Text>
              <View style={styles.chipsRow}>
                {dislikes.map((item) => (
                  <View key={item} style={styles.chipNeutral}>
                    <Text style={styles.chipNeutralText}>{item}</Text>
                    <TouchableOpacity onPress={() => removeDislike(item)}>
                      <X size={14} color={colors.onSurfaceVariant} strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.chipAddCircle} activeOpacity={0.7}>
                  <Plus size={16} color={colors.primary} strokeWidth={3} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Preferences Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Preferences</Text>
              <Utensils size={24} color={colors.tertiary} fill={colors.tertiary} />
            </View>

            {/* Blacklist navigation */}
            <TouchableOpacity
              style={styles.prefRow}
              activeOpacity={0.75}
              onPress={() => navigation.navigate('Blacklist')}
            >
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle}>🚫 Danh sách đen</Text>
                <Text style={styles.prefDesc}>Quản lý món/nguyên liệu bị loại khỏi AI</Text>
              </View>
              <ChevronRight size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>

            <View style={styles.prefRow}>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle}>Daily Goal</Text>
                <Text style={styles.prefDesc}>1,800 - 2,200 kcal</Text>
              </View>
              <ChevronRight size={20} color={colors.onSurfaceVariant} />
            </View>

            <View style={styles.prefRow}>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle}>Smart Notifications</Text>
                <Text style={styles.prefDesc}>Meal prep reminders & list alerts</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.surfaceContainerHighest, true: colors.primaryFixed }}
                thumbColor="#fff"
              />
            </View>
          </View>

        </View>

        {/* Action Buttons */}
        <View style={styles.actionsBox}>
          <TouchableOpacity
            style={styles.saveBtn}
            activeOpacity={0.9}
            disabled={saving}
            onPress={async () => {
              setSaving(true);
              try {
                const { error } = await supabase.from('profiles').upsert({
                  cooking_experience: experience,
                  allergies,
                  dislikes,
                  notifications,
                  updated_at: new Date().toISOString(),
                });
                if (error) throw error;
                Toast.show({ type: 'success', text1: 'Đã lưu! ✅', text2: 'Cài đặt đã được cập nhật.', position: 'bottom' });
              } catch (err: any) {
                Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể lưu. Thử lại nhé!' });
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? <ActivityIndicator color={colors.onPrimary} /> : <Text style={styles.saveBtnText}>Lưu thay đổi</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signOutBtn}
            activeOpacity={0.6}
            onPress={async () => { await supabase.auth.signOut(); }}
          >
            <Text style={styles.signOutBtnText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    height: 64,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  brandText: {
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
    color: colors.primaryFixed,
    letterSpacing: -0.5,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primaryFixed,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 100,
  },
  pageHeader: {
    marginBottom: 40,
  },
  pageTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.onSurface,
    letterSpacing: -2,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 18,
    color: colors.onSurfaceVariant,
  },
  sectionsContainer: {
    gap: 40,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.onSurface,
  },
  cardDesc: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xl,
    marginTop: -8,
  },
  formGroup: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  inputField: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: 16,
    fontSize: 16,
    color: colors.onSurface,
    fontFamily: 'Be Vietnam Pro',
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: 12,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
  },
  segmentTextActive: {
    color: colors.onPrimary,
  },
  blacklistGroup: {
    marginBottom: 32,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.errorContainer,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  chipErrorText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onErrorContainer,
  },
  chipAddError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  chipAddText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
  },
  chipNeutral: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  chipNeutralText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
  },
  chipAddCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLow,
    padding: 16,
    borderRadius: radius.md,
    marginBottom: 16,
  },
  prefTextCol: {
    gap: 4,
  },
  prefTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.onSurface,
  },
  prefDesc: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  actionsBox: {
    marginTop: 40,
    gap: 16,
  },
  saveBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  saveBtnText: {
    color: colors.onPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  signOutBtn: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  signOutBtnText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default SettingsScreen;
