import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Trash2, Plus, X, ListFilter } from 'lucide-react-native';
import { supabase } from '../services/supabase';
import Toast from 'react-native-toast-message';

interface BlacklistItem {
  id: string;
  item_name: string;
}

const BlacklistScreen = () => {
  const [items, setItems] = useState<BlacklistItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchBlacklist = async () => {
    try {
      const { data, error } = await supabase
        .from('blacklist')
        .select('id, item_name')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      console.error('Error fetching blacklist:', err);
      // Toast.show({ type: 'error', text1: 'Lỗi tải dữ liệu', text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!newItem.trim()) return;
    setAdding(true);
    try {
      const { data, error } = await supabase
        .from('blacklist')
        .insert([{ item_name: newItem.trim() }])
        .select();

      if (error) throw error;
      
      setItems([data[0], ...items]);
      setNewItem('');
      Toast.show({ type: 'success', text1: 'Đã thêm!', text2: `"${newItem}" vào danh sách đen.`, position: 'bottom' });
    } catch (err: any) {
      console.error('Error adding to blacklist:', err);
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể thêm mục này.' });
    } finally {
      setAdding(false);
    }
  };

  const removeItem = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from('blacklist')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setItems(items.filter(item => item.id !== id));
      Toast.show({ type: 'info', text1: 'Đã xóa', text2: `Gỡ "${name}" khỏi danh sách.`, position: 'bottom' });
    } catch (err: any) {
      console.error('Error removing from blacklist:', err);
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể xóa mục này.' });
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-6 pt-6 pb-4">
        <Text className="text-slate-900 text-3xl font-black leading-tight">Danh sách đen</Text>
        <Text className="text-slate-500 font-medium text-lg">AI sẽ không gợi ý các món này</Text>
      </View>

      {/* Input Section */}
      <View className="px-6 mt-4">
        <View className="flex-row items-center bg-white p-2 rounded-3xl border-2 border-slate-100 shadow-sm shadow-slate-100">
          <View className="p-3 bg-slate-50 rounded-2xl">
            <ListFilter size={20} color="#64748b" />
          </View>
          <TextInput
            placeholder="Thêm món/nguyên liệu mới..."
            className="flex-1 ml-3 text-slate-800 text-lg font-bold"
            value={newItem}
            onChangeText={setNewItem}
            onSubmitEditing={addItem}
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity 
            onPress={addItem}
            disabled={adding || !newItem.trim()}
            activeOpacity={0.7}
            className={`p-3 rounded-2xl ${newItem.trim() ? 'bg-indigo-600' : 'bg-slate-100'}`}
          >
            {adding ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Plus size={24} color={newItem.trim() ? "#ffffff" : "#94a3b8"} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Chips List */}
      <ScrollView className="flex-1 px-6 mt-8">
        <View className="flex-row flex-wrap gap-3">
          {loading ? (
             <ActivityIndicator size="large" color="#4f46e5" className="w-full mt-20" />
          ) : items.length === 0 ? (
            <View className="w-full mt-20 items-center justify-center">
              <X size={64} color="#e2e8f0" />
              <Text className="text-slate-400 font-bold text-lg mt-4">Trống trơn!</Text>
            </View>
          ) : (
            items.map((item) => (
              <View 
                key={item.id} 
                className="flex-row items-center bg-white pl-5 pr-3 py-3 rounded-2xl border border-slate-100 shadow-sm"
              >
                <Text className="text-slate-800 font-black text-base">{item.item_name}</Text>
                <TouchableOpacity 
                  onPress={() => removeItem(item.id, item.item_name)}
                  className="ml-3 p-1 bg-red-50 rounded-full"
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BlacklistScreen;
