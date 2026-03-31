import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ 
  label, 
  options, 
  selectedValue, 
  onValueChange,
  className = ""
}) => {
  return (
    <View className={`mb-6 ${className}`}>
      <Text className="text-slate-900 font-extrabold text-lg mb-3 ml-1">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onValueChange(option.value)}
              activeOpacity={0.7}
              className={`
                px-5 py-3 rounded-2xl border-2 transition-all 
                ${isSelected 
                  ? 'bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-200' 
                  : 'bg-white border-slate-100 shadow-sm'}
              `}
            >
              <Text className={`
                font-bold text-base 
                ${isSelected ? 'text-white' : 'text-slate-600'}
              `}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default Select;
