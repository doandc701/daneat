import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, History, Settings } from 'lucide-react-native';
import { colors } from '../theme/theme';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BlacklistScreen from '../screens/BlacklistScreen';

const Tab = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();

const SettingsNavigator = () => (
  <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
    <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
    <SettingsStack.Screen name="Blacklist" component={BlacklistScreen} />
  </SettingsStack.Navigator>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryFixed,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const iconSize = size - 2;
          if (route.name === 'Home') {
            return (
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Home size={iconSize} color={color} strokeWidth={focused ? 2.5 : 1.8} />
              </View>
            );
          }
          if (route.name === 'History') {
            return (
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <History size={iconSize} color={color} strokeWidth={focused ? 2.5 : 1.8} />
              </View>
            );
          }
          if (route.name === 'Settings') {
            return (
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Settings size={iconSize} color={color} strokeWidth={focused ? 2.5 : 1.8} />
              </View>
            );
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Trang chủ' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: 'Lịch sử' }} />
      <Tab.Screen name="Settings" component={SettingsNavigator} options={{ tabBarLabel: 'Cài đặt' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    height: 68,
    paddingBottom: 10,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  iconWrap: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#fff0e8',
  },
});

export default TabNavigator;
