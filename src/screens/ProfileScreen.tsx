import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { User, Settings, CreditCard, Bell, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

const ProfileScreen = () => {
  const menuItems = [
    { icon: <User size={22} color="#475569" />, title: 'Edit Profile', hasValue: false },
    { icon: <CreditCard size={22} color="#475569" />, title: 'Payment Methods', hasValue: false },
    { icon: <Bell size={22} color="#475569" />, title: 'Notifications', hasValue: true, value: true },
    { icon: <Settings size={22} color="#475569" />, title: 'Settings', hasValue: false },
    { icon: <HelpCircle size={22} color="#475569" />, title: 'Support', hasValue: false },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-6 pt-10">
        {/* Profile Info */}
        <View className="items-center mb-10">
          <View className="h-24 w-24 bg-indigo-50 rounded-full items-center justify-center mb-4 border-2 border-indigo-100 shadow-sm">
            <User size={48} color="#4f46e5" />
          </View>
          <Text className="text-2xl font-extrabold text-slate-900 mb-1">Alex John</Text>
          <Text className="text-slate-500 font-medium">alex.john@example.com</Text>
        </View>

        {/* Menu Items */}
        <View className="bg-slate-50 rounded-3xl p-4 mb-10 border border-slate-100">
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              className={`flex-row items-center justify-between py-4 ${index !== menuItems.length - 1 ? 'border-b border-slate-100' : ''}`}
            >
              <View className="flex-row items-center gap-3">
                {item.icon}
                <Text className="text-slate-800 text-lg font-semibold">{item.title}</Text>
              </View>
              {item.hasValue ? (
                <Switch 
                  trackColor={{ false: "#e2e8f0", true: "#818cf8" }}
                  thumbColor={item.value ? "#4f46e5" : "#f1f5f9"}
                  value={item.value as boolean}
                />
              ) : (
                <ChevronRight size={20} color="#cbd5e1" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity className="flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100 mb-10">
          <LogOut size={20} color="#ef4444" />
          <Text className="text-red-500 text-lg font-bold">Log Out</Text>
        </TouchableOpacity>

        <Text className="text-center text-slate-300 font-medium mb-10">Version 1.0.0 (Build 34)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
