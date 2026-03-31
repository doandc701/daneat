import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Search, User, History, Settings, ListFilter, UserCog } from 'lucide-react-native';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';
import BlacklistScreen from '../screens/BlacklistScreen';

const Tab = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();

const SettingsNavigator = () => {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="Profile" component={ProfileSettingsScreen} />
      <SettingsStack.Screen name="Blacklist" component={BlacklistScreen} />
    </SettingsStack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          if (route.name === 'Home') icon = <Home size={size} color={color} />;
          else if (route.name === 'History') icon = <History size={size} color={color} />;
          else if (route.name === 'Settings') icon = <UserCog size={size} color={color} />;
          return icon;
        },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700'
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
