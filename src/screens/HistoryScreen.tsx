import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Alert,
} from 'react-native';
import { Clock, ChefHat, Trash2, RefreshCw } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { colors, spacing, radius } from '../theme/theme';
import Toast from 'react-native-toast-message';

// ─── Types ────────────────────────────────────────────────────────────────
interface MealHistoryItem {
  id: string;
  meal_name: string;
  reasoning: string;
  ingredients: string[];
  steps: string[];
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────
const formatDate = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatTime = (iso: string) => {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

// ─── Empty State ──────────────────────────────────────────────────────────
const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => (
  <View style={styles.emptyWrap}>
    <View style={styles.emptyIconWrap}>
      <ChefHat size={52} color={colors.primaryFixed} strokeWidth={1.2} />
    </View>
    <Text style={styles.emptyTitle}>Chưa có lịch sử nào</Text>
    <Text style={styles.emptySubtitle}>
      Về trang chủ, bấm "Chốt đơn" để lưu món ăn vào đây nhé!
    </Text>
    <TouchableOpacity style={styles.emptyBtn} onPress={onRefresh} activeOpacity={0.8}>
      <RefreshCw size={16} color={colors.primaryFixed} />
      <Text style={styles.emptyBtnText}>Làm mới</Text>
    </TouchableOpacity>
  </View>
);

// ─── History Card ──────────────────────────────────────────────────────────
const HistoryCard = ({
  item,
  onDelete,
}: {
  item: MealHistoryItem;
  onDelete: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.92}
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.mealIconWrap}>
            <Text style={styles.mealIcon}>🍽️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.mealName} numberOfLines={2}>{item.meal_name}</Text>
            <View style={styles.metaRow}>
              <Clock size={11} color={colors.outline} />
              <Text style={styles.metaText}>
                {formatDate(item.created_at)} · {formatTime(item.created_at)}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(item.id)}
          hitSlop={8}
        >
          <Trash2 size={16} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* Reasoning */}
      <View style={styles.reasoningRow}>
        <Text style={styles.reasoningText} numberOfLines={expanded ? undefined : 2}>
          "{item.reasoning}"
        </Text>
      </View>

      {/* Expanded: Ingredients */}
      {expanded && (
        <View style={styles.expandedWrap}>
          <Text style={styles.expandLabel}>NGUYÊN LIỆU</Text>
          <View style={styles.chipsRow}>
            {item.ingredients?.map((ing, i) => (
              <View key={i} style={styles.chip}>
                <Text style={styles.chipText}>{ing}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.expandLabel, { marginTop: 16 }]}>CÁC BƯỚC</Text>
          {item.steps?.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNum}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Expand toggle */}
      <View style={styles.expandToggleRow}>
        <View style={styles.toggleLine} />
        <Text style={styles.expandToggleText}>{expanded ? '▲ Thu gọn' : '▼ Xem chi tiết'}</Text>
        <View style={styles.toggleLine} />
      </View>
    </TouchableOpacity>
  );
};

// ─── Group by Date ────────────────────────────────────────────────────────
const groupByDate = (items: MealHistoryItem[]) => {
  const groups: Record<string, MealHistoryItem[]> = {};
  items.forEach(item => {
    const label = formatDate(item.created_at);
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });
  return groups;
};

// ─── Main Screen ──────────────────────────────────────────────────────────
const HistoryScreen = () => {
  const [items, setItems] = useState<MealHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('meal_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      console.error('History fetch error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refetch whenever tab is focused
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchHistory();
    }, [fetchHistory])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Xoá khỏi lịch sử?',
      'Món ăn này sẽ bị xoá vĩnh viễn.',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('meal_history').delete().eq('id', id);
              if (error) throw error;
              setItems(prev => prev.filter(i => i.id !== id));
              Toast.show({ type: 'success', text1: 'Đã xoá!', position: 'bottom' });
            } catch (err: any) {
              Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể xoá. Thử lại nhé!' });
            }
          },
        },
      ]
    );
  };

  const groups = groupByDate(items);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.brandLabel}>SmartEat</Text>
          <Text style={styles.pageTitle}>Lịch sử</Text>
        </View>
        {items.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{items.length} món</Text>
          </View>
        )}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primaryFixed}
              colors={[colors.primaryFixed]}
            />
          }
        >
          {items.length === 0 ? (
            <EmptyState onRefresh={handleRefresh} />
          ) : (
            Object.entries(groups).map(([dateLabel, groupItems]) => (
              <View key={dateLabel} style={styles.group}>
                {/* Date Group Label */}
                <View style={styles.groupLabelRow}>
                  <View style={styles.groupLabelDot} />
                  <Text style={styles.groupLabel}>{dateLabel}</Text>
                  <View style={styles.groupLine} />
                </View>

                {groupItems.map(item => (
                  <HistoryCard key={item.id} item={item} onDelete={handleDelete} />
                ))}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  brandLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.primaryFixed,
    marginBottom: 2,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.onBackground,
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: colors.tertiaryContainer,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    marginBottom: 4,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.tertiary,
  },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: 60 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: colors.onSurfaceVariant, fontSize: 14, fontWeight: '600' },

  // Groups
  group: { marginBottom: 8 },
  groupLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 20, gap: 10 },
  groupLabelDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primaryFixed },
  groupLabel: { fontSize: 13, fontWeight: '800', color: colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1 },
  groupLine: { flex: 1, height: 1, backgroundColor: colors.surfaceContainer },

  // Card
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: colors.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    paddingBottom: 8,
  },
  cardHeaderLeft: { flex: 1, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  mealIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  mealIcon: { fontSize: 24 },
  mealName: { fontSize: 16, fontWeight: '800', color: colors.onSurface, lineHeight: 22, flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaText: { fontSize: 11, color: colors.outline, fontWeight: '500' },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#fff0ee',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Reasoning
  reasoningRow: { paddingHorizontal: 16, paddingBottom: 12 },
  reasoningText: { fontSize: 13, color: colors.onSurfaceVariant, fontStyle: 'italic', lineHeight: 20 },

  // Expanded
  expandedWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: colors.surfaceContainerLow,
  },
  expandLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.onSurfaceVariant,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 14,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: colors.tertiaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  chipText: { fontSize: 12, fontWeight: '700', color: colors.tertiary },
  stepRow: { flexDirection: 'row', gap: 10, marginBottom: 8, alignItems: 'flex-start' },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNum: { color: '#fff', fontSize: 11, fontWeight: '900' },
  stepText: { flex: 1, fontSize: 13, color: colors.onSurface, lineHeight: 20, fontWeight: '500' },

  // Toggle
  expandToggleRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  toggleLine: { flex: 1, height: 1, backgroundColor: colors.surfaceContainer },
  expandToggleText: { fontSize: 11, color: colors.outline, fontWeight: '700' },

  // Empty
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: '#fff5f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: { fontSize: 22, fontWeight: '900', color: colors.onSurface, textAlign: 'center', marginBottom: 10 },
  emptySubtitle: { fontSize: 14, color: colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22 },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 28,
    backgroundColor: '#fff5f0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.primaryFixed,
  },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary },
});

export default HistoryScreen;
