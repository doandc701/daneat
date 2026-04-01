import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Animated,
  StatusBar,
} from 'react-native';
import { Utensils, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';
import { supabase } from '../services/supabase';

// ─── Types ────────────────────────────────────────────────────────────────
type AuthMode = 'login' | 'signup';

// ─── Input Field Component ─────────────────────────────────────────────────
const AuthInput = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  onSubmitEditing,
  returnKeyType,
  rightElement,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  onSubmitEditing?: () => void;
  returnKeyType?: any;
  rightElement?: React.ReactNode;
}) => (
  <View style={inputStyles.wrap}>
    <View style={inputStyles.iconWrap}>{icon}</View>
    <TextInput
      style={inputStyles.field}
      placeholder={placeholder}
      placeholderTextColor={colors.outline}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize ?? 'none'}
      onSubmitEditing={onSubmitEditing}
      returnKeyType={returnKeyType ?? 'next'}
    />
    {rightElement}
  </View>
);

const inputStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    height: 56,
  },
  iconWrap: { marginRight: 12 },
  field: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.onSurface,
    fontWeight: '500',
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────
const AuthScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  // Animated underline for mode tabs
  const tabAnim = useRef(new Animated.Value(mode === 'login' ? 0 : 1)).current;

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setErrorMsg(null);
    setSuccessMsg(null);
    setPassword('');
    setConfirmPassword('');
    Animated.timing(tabAnim, {
      toValue: m === 'login' ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const clearError = () => setErrorMsg(null);

  const handleAuth = async () => {
    clearError();
    setSuccessMsg(null);

    if (!email.trim()) return setErrorMsg('Vui lòng nhập địa chỉ email.');
    if (!password) return setErrorMsg('Vui lòng nhập mật khẩu.');
    if (password.length < 6) return setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự.');

    if (mode === 'signup') {
      if (password !== confirmPassword) return setErrorMsg('Mật khẩu xác nhận không khớp.');
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) throw error;

        if (data.session) {
          // Auto-confirmed → Onboarding
          navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
        } else {
          // Email confirmation required
          setSuccessMsg('📧 Kiểm tra email của bạn để xác nhận tài khoản!');
          setLoading(false);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) throw error;
        // onAuthStateChange in RootNavigator will auto-navigate to Main
      }
    } catch (err: any) {
      const raw = err?.message ?? '';
      if (raw.includes('Invalid login credentials'))
        setErrorMsg('Email hoặc mật khẩu không chính xác.');
      else if (raw.includes('User already registered'))
        setErrorMsg('Email này đã được đăng ký. Hãy đăng nhập.');
      else if (raw.includes('Email not confirmed'))
        setErrorMsg('Email chưa được xác nhận. Kiểm tra hộp thư của bạn.');
      else setErrorMsg(raw || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const tabIndicatorLeft = tabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>

            {/* ── Brand Hero ── */}
            <View style={styles.hero}>
              <View style={styles.logoRing}>
                <View style={styles.logoInner}>
                  <Utensils size={28} color={colors.onPrimary} strokeWidth={2.5} />
                </View>
              </View>
              <Text style={styles.brandName}>SmartEat</Text>
              <Text style={styles.tagline}>Your AI Curated Meal</Text>
            </View>

            {/* ── Card ── */}
            <View style={styles.card}>

              {/* ── Mode Tabs ── */}
              <View style={styles.tabsWrap}>
                <View style={styles.tabsRow}>
                  <TouchableOpacity style={styles.tabBtn} onPress={() => switchMode('login')} activeOpacity={0.7}>
                    <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                      Đăng nhập
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.tabBtn} onPress={() => switchMode('signup')} activeOpacity={0.7}>
                    <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                      Đăng ký
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.tabTrack}>
                  <Animated.View style={[styles.tabIndicator, { left: tabIndicatorLeft }]} />
                </View>
              </View>

              {/* ── Form ── */}
              <View style={styles.form}>

                {/* Success Banner */}
                {successMsg && (
                  <View style={styles.successBanner}>
                    <Text style={styles.successText}>{successMsg}</Text>
                  </View>
                )}

                {/* Error Banner */}
                {errorMsg && (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
                  </View>
                )}

                {/* Email */}
                <AuthInput
                  icon={<Mail size={18} color={colors.onSurfaceVariant} />}
                  placeholder="Email của bạn"
                  value={email}
                  onChangeText={(t) => { setEmail(t); clearError(); }}
                  keyboardType="email-address"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  returnKeyType="next"
                />

                {/* Password */}
                <AuthInput
                  icon={<Lock size={18} color={colors.onSurfaceVariant} />}
                  placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                  value={password}
                  onChangeText={(t) => { setPassword(t); clearError(); }}
                  secureTextEntry={!showPassword}
                  onSubmitEditing={() => mode === 'signup' ? confirmRef.current?.focus() : handleAuth()}
                  returnKeyType={mode === 'signup' ? 'next' : 'done'}
                  rightElement={
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                      {showPassword
                        ? <EyeOff size={18} color={colors.outline} />
                        : <Eye size={18} color={colors.outline} />
                      }
                    </TouchableOpacity>
                  }
                />

                {/* Confirm Password — chỉ hiện khi đăng ký */}
                {mode === 'signup' && (
                  <AuthInput
                    icon={<Lock size={18} color={colors.onSurfaceVariant} />}
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChangeText={(t) => { setConfirmPassword(t); clearError(); }}
                    secureTextEntry={!showPassword}
                    onSubmitEditing={handleAuth}
                    returnKeyType="done"
                  />
                )}

                {/* Forgot password */}
                {mode === 'login' && (
                  <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
                    <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                  </TouchableOpacity>
                )}

                {/* Submit Button */}
                <TouchableOpacity
                  style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                  onPress={handleAuth}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.onPrimary} />
                  ) : (
                    <View style={styles.submitBtnInner}>
                      <Text style={styles.submitBtnText}>
                        {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
                      </Text>
                      <ArrowRight size={20} color={colors.onPrimary} />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Footer ── */}
            <Text style={styles.footer}>
              Bằng cách tiếp tục, bạn đồng ý với{' '}
              <Text style={styles.footerLink}>Điều khoản dịch vụ</Text>
              {' & '}
              <Text style={styles.footerLink}>Chính sách bảo mật</Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: 24,
  },

  // Hero
  hero: { alignItems: 'center', marginBottom: 40 },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,122,47,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoInner: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 42,
    fontWeight: '900',
    fontStyle: 'italic',
    color: colors.primary,
    letterSpacing: -1.5,
  },
  tagline: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
  },

  // Card
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 28,
    elevation: 8,
  },

  // Tabs
  tabsWrap: { backgroundColor: colors.surfaceContainerLowest },
  tabsRow: { flexDirection: 'row' },
  tabBtn: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  tabTrack: {
    height: 3,
    backgroundColor: colors.surfaceContainer,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: colors.primaryFixed,
    borderRadius: 2,
  },

  // Form
  form: {
    padding: 24,
    gap: 14,
  },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },

  // Submit button
  submitBtn: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  submitBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  submitBtnText: {
    color: colors.onPrimary,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // Banners
  errorBanner: {
    backgroundColor: '#fff0ee',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
    lineHeight: 20,
  },
  successBanner: {
    backgroundColor: '#f0fff4',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  successText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16a34a',
    lineHeight: 20,
  },

  // Footer
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.outline,
    marginTop: 24,
    lineHeight: 18,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default AuthScreen;
