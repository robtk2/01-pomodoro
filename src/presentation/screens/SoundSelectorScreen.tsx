import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@theme";
import { useSettingsStore } from "@application/store/useSettingsStore";
import { HapticService } from "@infrastructure/services/HapticService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@presentation/navigation/AppNavigator";
import { GlassCard } from "@presentation/components/ui/GlassCard";
import { ObsidianHeader } from "@presentation/components/layout/ObsidianHeader";
import { Button } from "@presentation/components/ui/Button";

type Props = NativeStackScreenProps<RootStackParamList, "SoundSelector">;

/**
 * Pantalla de Selección de Sonidos Premium.
 * Permite previsualizar y seleccionar tonos del sistema con feedback háptico.
 */
export const SoundSelectorScreen: React.FC<Props> = ({ route, navigation }) => {
  const { isSelection, currentSoundUri } = route.params || {};
  const Theme = useTheme();

  const { 
    availableSounds, 
    loadAvailableSounds, 
    defaultSound, 
    setDefaultSound, 
    playSoundPreview,
    stopSoundPreview,
    isLoading 
  } = useSettingsStore();

  const [tempSelectedUri, setTempSelectedUri] = useState<string | null>(
    isSelection ? (currentSoundUri || null) : (defaultSound?.uri || null)
  );

  useEffect(() => {
    loadAvailableSounds();
    return () => {
      stopSoundPreview();
    };
  }, []);

  const handleSelectSound = async (sound: { name: string; uri: string }) => {
    setTempSelectedUri(sound.uri);
    HapticService.selection();

    if (!isSelection) {
      setDefaultSound(sound);
    }
    
    await playSoundPreview(sound.uri);
  };

  const handleConfirmSelection = () => {
    if (isSelection && tempSelectedUri) {
      HapticService.success();
      navigation.navigate("EditMode", { 
        selectedSoundUri: tempSelectedUri,
        // @ts-ignore
        selectedSoundName: availableSounds.find(s => s.uri === tempSelectedUri)?.name
      } as any);
    }
  };

  const renderItem = ({ item }: { item: { name: string; uri: string } }) => {
    const isSelected = tempSelectedUri === item.uri;

    return (
      <GlassCard 
        style={[
          styles.itemCard, 
          isSelected && { borderColor: Theme.colors.primary, borderWidth: 1 }
        ]}
      >
        <Button 
          style={[styles.itemInner, { padding: Theme.spacing.m }]}
          onPress={() => handleSelectSound(item)}
        >
          <View style={styles.infoContainer}>
            <Text 
              style={[
                styles.itemName,
                { 
                  fontFamily: Theme.typography.fontFamily.medium,
                  fontSize: Theme.typography.fontSize.body,
                  color: Theme.colors.text
                },
                isSelected && { color: Theme.colors.primary }
              ]}
            >
              {item.name}
            </Text>
            {isSelected && (
              <Text style={[styles.selectedLabel, { color: Theme.colors.primary, fontFamily: Theme.typography.fontFamily.bold }]}>Seleccionado</Text>
            )}
          </View>
          
          <View 
            style={[
              styles.playButton,
              { backgroundColor: Theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.4)' },
              isSelected && { backgroundColor: Theme.colors.primary }
            ]}
          >
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
    <View style={styles.container}>
      <ObsidianHeader 
        title="SELECCIONAR SONIDO" 
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      {isLoading && availableSounds.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text 
            style={[
              styles.loadingText, 
              { 
                fontFamily: Theme.typography.fontFamily.medium,
                marginTop: Theme.spacing.m,
                color: Theme.colors.textSecondary,
                fontSize: Theme.typography.fontSize.body,
              }
            ]}
          >
            Escaneando el sistema...
          </Text>
        </View>
      ) : (
        <FlatList
          data={availableSounds}
          keyExtractor={(item) => item.uri}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, { padding: Theme.spacing.m, paddingBottom: 40 }]}
          ItemSeparatorComponent={() => <View style={[styles.separator, { height: Theme.spacing.s }]} />}
          ListEmptyComponent={
            <View style={[styles.emptyContainer, { padding: Theme.spacing.xl }]}>
              <Text style={[styles.emptyText, { fontFamily: Theme.typography.fontFamily.regular, color: Theme.colors.textTertiary }]}>No se encontraron sonidos.</Text>
            </View>
          }
        />
      )}

      {isSelection && (
        <View style={[styles.footer, { padding: Theme.spacing.m }]}>
          <Button 
            style={[
              styles.confirmButton, 
              { 
                backgroundColor: Theme.colors.primary, 
                padding: Theme.spacing.m, 
                borderRadius: Theme.roundness,
                shadowColor: Theme.colors.primary 
              }
            ]}
            onPress={handleConfirmSelection}
            variant="primary"
          >
            <Text 
              style={[
                styles.confirmButtonText, 
                { 
                  fontFamily: Theme.typography.fontFamily.bold,
                  color: Theme.colors.background,
                  fontSize: Theme.typography.fontSize.small,
                }
              ]}
            >
              CONFIRMAR SELECCIÓN
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
  },
  listContent: {
  },
  itemCard: {
    padding: 0,
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
  },
  selectedLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    fontSize: 14,
  },
  separator: {
  },
  emptyContainer: {
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
  },
  footer: {
    paddingBottom: 40,
  },
  confirmButton: {
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonText: {
    letterSpacing: 1,
  },
});
