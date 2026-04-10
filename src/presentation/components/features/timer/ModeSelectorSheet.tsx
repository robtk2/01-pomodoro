import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TimerMode } from "@domain/modes/types";
import { formatTimeDisplay } from "@domain/timer/logic";
import { useTheme } from "@theme";
import { GlassCard } from "@presentation/components/ui/GlassCard";
import { GlassBottomSheet } from "@presentation/components/ui/GlassBottomSheet";
import { Button } from "@presentation/components/ui/Button";

interface ModeSelectorSheetProps {
  isVisible: boolean;
  onClose: () => void;
  modes: TimerMode[];
  currentModeId: string;
  onSelectMode: (id: string) => void;
}

export const ModeSelectorSheet: React.FC<ModeSelectorSheetProps> = ({
  isVisible,
  onClose,
  modes,
  currentModeId,
  onSelectMode,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const Theme = useTheme();

  const filteredModes = useMemo(() => {
    return modes.filter((mode) =>
      mode.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [modes, searchQuery]);

  const renderItem = ({ item }: { item: TimerMode }) => {
    const isActive = item.id === currentModeId;

    return (
      <Button
        style={[styles.gridItem, { margin: Theme.spacing.s }]}
        onPress={() => {
          onSelectMode(item.id);
          onClose();
        }}
      >
        <GlassCard
          intensity={isActive ? 40 : 15}
          contentStyle={[styles.modeCardContent, { paddingVertical: Theme.spacing.l, paddingHorizontal: Theme.spacing.s }]}
          style={[
            styles.modeCardContainer,
            isActive && { borderColor: item.color, borderWidth: 1.5 },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${item.color}20`, marginBottom: Theme.spacing.m }]}>
            <Ionicons name={item.icon as any} size={28} color={item.color} />
          </View>
          <Text 
            style={[
              styles.modeLabel, 
              { 
                color: Theme.colors.text,
                fontFamily: Theme.typography.fontFamily.semibold
              }
            ]} 
            numberOfLines={1}
          >
            {item.label}
          </Text>
          <Text style={[styles.modeTime, { color: item.color, fontFamily: Theme.typography.fontFamily.medium }]}>
            {formatTimeDisplay(item.time)}
          </Text>
        </GlassCard>
      </Button>
    );
  };

  return (
    <GlassBottomSheet
      isVisible={isVisible}
      onClose={onClose}
      title="Seleccionar Modo"
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Buscar modo..."
    >
      <FlatList
        data={filteredModes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: Theme.spacing.m, paddingBottom: Theme.spacing.xxl }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { paddingVertical: Theme.spacing.xxl }]}>
            <Ionicons name="search-outline" size={48} color={Theme.colors.surfaceTertiary} />
            <Text style={[styles.emptyText, { color: Theme.colors.textSecondary, fontFamily: Theme.typography.fontFamily.medium, marginTop: Theme.spacing.m }]}>No se encontraron modos</Text>
          </View>
        }
      />
    </GlassBottomSheet>
  );
};

const styles = StyleSheet.create({
  listContent: {
  },
  gridItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modeCardContainer: {
    width: "100%", 
  },
  modeCardContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  modeLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  modeTime: {
    fontSize: 14,
    opacity: 0.9,
  },
});
