import React from 'react';
import { View, Text, SafeAreaView, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';

const ExploreScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-4 mb-6">
        <Text className="text-slate-900 text-3xl font-extrabold mb-4">Explore</Text>
        <View className="bg-slate-100 flex-row items-center px-4 py-3 rounded-2xl border border-slate-200">
          <Search size={20} color="#64748b" />
          <TextInput 
            placeholder="What are you craving?" 
            className="ml-3 flex-1 text-slate-800 text-base"
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <ScrollView className="px-6">
        <Text className="text-slate-900 text-xl font-bold mb-4">Popular Near You</Text>
        {[1, 2, 3].map((item) => (
          <TouchableOpacity key={item} className="mb-6 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            <View className="h-48 bg-slate-200" />
            <View className="p-4">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-slate-900 text-lg font-bold">Gourmet Burger Kitchen</Text>
                <View className="bg-green-100 px-2 py-1 rounded-lg">
                  <Text className="text-green-700 font-bold text-xs">4.8 ★</Text>
                </View>
              </View>
              <Text className="text-slate-500 font-medium italic">Burgers • American • $$</Text>
              <View className="flex-row mt-3 items-center">
                <Text className="text-slate-400 text-sm">2.4 km • 25-35 mins</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreScreen;
