import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@theme";
import { useSettingsStore } from "@application/store/useSettingsStore";
import { HapticService } from "@infrastructure/services/HapticService";
import { GlassCard } from "@presentation/components/ui/GlassCard";
import { GlassBottomSheet } from "@presentation/components/ui/GlassBottomSheet";
import { Button } from "@presentation/components/ui/Button";

interface SoundSelectorSheetProps {
  isVisible: boolean;
  onClose: () => void;
  currentSoundUri?: string;
  onSelectSound: (uri: string) => void;
}

export const SoundSelectorSheet: React.FC<SoundSelectorSheetProps> = ({
  isVisible,
  onClose,
  currentSoundUri,
  onSelectSound,
}) => {
  const {
    availableSounds,
    loadAvailableSounds,
    playSoundPreview,
    stopSoundPreview,
    isLoading,
  } = useSettingsStore();

  const Theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUri, setSelectedUri] = useState<string | undefined>(currentSoundUri);

  useEffect(() => {
    if (isVisible) {
      loadAvailableSounds();
      setSelectedUri(currentSoundUri);
    }
    return () => {
      stopSoundPreview();
    };
  }, [isVisible, currentSoundUri]);

  const filteredSounds = useMemo(() => {
    return availableSounds.filter((sound) =>
      sound.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableSounds, searchQuery]);

  const handleSelectSound = async (sound: { name: string; uri: string }) => {
    setSelectedUri(sound.uri);
    HapticService.selection();
    await playSoundPreview(sound.uri);
  };

  const handleConfirm = () => {
    if (selectedUri) {
      onSelectSound(selectedUri);
      HapticService.success();
      onClose();
    }
  };

  const renderItem = ({ item }: { item: { name: string; uri: string } }) => {
    const isSelected = selectedUri === item.uri;

    return (
      <GlassCard
        style={[
          styles.itemCard,
          { marginBottom: Theme.spacing.s },
          isSelected && { borderColor: Theme.colors.primary, borderWidth: 1 }
        ]}
      >
        <Button
          style={[styles.itemInner, { padding: Theme.spacing.m }]}
          onPress={() => handleSelectSound(item)}
        >
          <View style={styles.infoContainer}>
            <Text style={[
              styles.itemName,
              { 
                color: Theme.colors.text,
                fontFamily: Theme.typography.fontFamily.medium
              },
              isSelected && { color: Theme.colors.primary, fontFamily: Theme.typography.fontFamily.bold }
            ]}>
              {item.name}
            </Text>
          </View>
          
          <View style={[
            styles.playIndicator,
            { 
              backgroundColor: Theme.mode === 'dark' ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
              marginLeft: Theme.spacing.m
            },
            isSelected && { backgroundColor: Theme.colors.primary }
          ]}>
            <Ionicons 
              name={isSelected ? "volume-medium" : "volume-mute-outline"} 
              size={18} 
              color={isSelected ? Theme.colors.background : Theme.colors.textTertiary} 
            />
          </View>
        </Button>
      </GlassCard>
    );
  };

  return (
    <GlassBottomSheet
      isVisible={isVisible}
      onClose={onClose}
      title="Seleccionar Alarma"
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Buscar sonido..."
    >
      {isLoading && availableSounds.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={[styles.loadingText, { color: Theme.colors.textSecondary, fontFamily: Theme.typography.fontFamily.medium, marginTop: Theme.spacing.m }]}>Cargando sonidos...</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={filteredSounds}
            keyExtractor={(item) => item.uri}
            renderItem={renderItem}
            contentContainerStyle={[styles.listContent, { paddingHorizontal: Theme.spacing.m, paddingBottom: Theme.spacing.l }]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={[styles.emptyContainer, { paddingVertical: Theme.spacing.xxl }]}>
                <Ionicons name="musical-notes-outline" size={48} color={Theme.colors.surfaceTertiary} />
                <Text style={[styles.emptyText, { color: Theme.colors.textSecondary, fontFamily: Theme.typography.fontFamily.regular, marginTop: Theme.spacing.m }]}>No se encontraron sonidos</Text>
              </View>
            }
          />
          
          <View 
            style={[
              styles.footer, 
              { 
                padding: Theme.spacing.m, 
                paddingBottom: Theme.spacing.xl,
                borderTopColor: Theme.mode === 'dark' ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.1)"
              }
            ]}
          >
            <Button
              title="CONFIRMAR"
              onPress={handleConfirm}
              disabled={!selectedUri}
              variant="primary"
            />
          </View>
        </View>
      )}
    </GlassBottomSheet>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  loadingText: {
  },
  listContent: {
  },
  itemCard: {
    padding: 0,
    backgroundColor: "transparent",
  },
  itemInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
  },
  playIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    borderTopWidth: 1,
  },
  emptyContainer: {
    alignItems: "center",
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
  },
});
