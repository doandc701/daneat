import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { History } from 'lucide-react-native';

const HistoryScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-6 pt-6 pb-4">
        <Text className="text-slate-900 text-3xl font-black">Lịch sử món ăn</Text>
        <Text className="text-slate-500 font-medium">Những món bạn đã chốt đơn</Text>
      </View>
      
      <ScrollView className="flex-1 px-6">
        <View className="mt-20 items-center justify-center">
          <History size={64} color="#cbd5e1" strokeWidth={1.5} />
          <Text className="text-slate-400 font-bold text-lg mt-4">Chưa có lịch sử nào</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
