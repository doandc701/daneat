import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  className = ""
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: '#e2e8f0' } as any,
        animatedStyle,
      ]}
      className={className}
    />
  );
};

export const MealCardSkeleton = () => (
  <View className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm w-full">
    <View className="flex-row justify-between items-start mb-6">
      <View className="flex-1 mr-4">
        <SkeletonLoader height={32} width="80%" className="mb-2" />
        <SkeletonLoader height={20} width="40%" />
      </View>
      <SkeletonLoader height={28} width={80} borderRadius={10} />
    </View>

    <View className="mb-8">
      <SkeletonLoader height={20} width={100} className="mb-4" />
      <View className="flex-row flex-wrap gap-2">
        <SkeletonLoader height={32} width={80} borderRadius={16} />
        <SkeletonLoader height={32} width={100} borderRadius={16} />
        <SkeletonLoader height={32} width={70} borderRadius={16} />
      </View>
    </View>

    <View>
      <SkeletonLoader height={20} width={120} className="mb-4" />
      <View className="space-y-3">
        <SkeletonLoader height={16} width="100%" />
        <SkeletonLoader height={16} width="90%" />
        <SkeletonLoader height={16} width="95%" />
      </View>
    </View>

    <View className="flex-row gap-4 mt-10">
      <SkeletonLoader height={56} className="flex-1" borderRadius={16} />
      <SkeletonLoader height={56} width={56} borderRadius={16} />
    </View>
  </View>
);

export default SkeletonLoader;
