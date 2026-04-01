import React, { useState } from 'react';
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
  Image,
} from 'react-native';
import { Utensils, Apple } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';

const AuthScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* Branding Header */}
            <View style={styles.headerContainer}>
              <View style={styles.logoBox}>
                <Utensils size={32} color={colors.onPrimaryContainer} strokeWidth={2.5} />
              </View>
              <Text style={styles.brandTitle}>SmartEat</Text>
              <Text style={styles.brandSubtitle}>
                Công cụ lập kế hoạch bữa ăn cá nhân của bạn.
              </Text>
            </View>

            {/* Login Card */}
            <View style={styles.card}>
              <View style={styles.formSpace}>
                {/* Email Field */}
                <View>
                  <Text style={styles.label}>ĐỊA CHỈ EMAIL</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="gourmet@example.com"
                    placeholderTextColor={colors.outline}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                {/* Password Field */}
                <View>
                  <View style={styles.passwordLabelRow}>
                    <Text style={styles.label}>MẬT KHẨU</Text>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={styles.forgotPassword}>QUÊN MẬT KHẨU?</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••••••"
                    placeholderTextColor={colors.outline}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                {/* Main CTA */}
                <TouchableOpacity 
                  style={styles.ctaButton} 
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('Onboarding')}
                >
                  <Text style={styles.ctaButtonText}>Đăng nhập vào Bếp</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerWrap}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>HOẶC KHÁM PHÁ VỚI</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social Logins */}
                <View style={styles.socialRow}>
                  <TouchableOpacity 
                    style={styles.socialBtnGoogle} 
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Onboarding')}
                  >
                    <Text style={styles.socialGoogleText}>G</Text>
                    <Text style={styles.socialTextGoogle}>Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.socialBtnApple} 
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Onboarding')}
                  >
                    <Apple size={20} color={colors.surfaceContainerLowest} fill={colors.surfaceContainerLowest} />
                    <Text style={styles.socialTextApple}>Apple</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Footer Link */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Mới tham gia? </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.footerAction}>Tạo tài khoản</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brandTitle: {
    fontSize: 48,
    fontWeight: '900',
    fontStyle: 'italic',
    color: colors.primary,
    letterSpacing: -1.5,
    marginBottom: spacing.sm,
  },
  brandSubtitle: {
    fontSize: 18,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    padding: 32,
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 8,
  },
  formSpace: {
    gap: spacing.xl,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(45, 47, 47, 0.7)', // onSurface with opacity
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: 4,
  },
  forgotPassword: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.onSurface,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  ctaButtonText: {
    color: colors.onPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.surfaceVariant,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: 10,
    fontWeight: '800',
    color: colors.outlineVariant,
    letterSpacing: 2,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialBtnGoogle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
    paddingVertical: 16,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  socialBtnApple: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.inverseSurface, // #0c0f0f
    paddingVertical: 16,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  socialGoogleText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#DB4437',
  },
  socialTextGoogle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.onSurface,
  },
  socialTextApple: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.surfaceContainerLowest,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  footerAction: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
});

export default AuthScreen;
