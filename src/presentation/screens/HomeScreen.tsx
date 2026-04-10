import React, { useState } from "react";
import { StyleSheet, View, Alert, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import { useTimerStore } from "@application/store/useTimerStore";
import { useSettingsStore } from "@application/store/useSettingsStore";
import { HapticService } from "@infrastructure/services/HapticService";
import { TimerHeader } from "@presentation/components/features/timer/TimerHeader";
import { TimerDisplay } from "@presentation/components/features/timer/TimerDisplay";
import { TimerControls } from "@presentation/components/features/timer/TimerControls";
import { TimerMode } from "@domain/modes/types";
import { ObsidianHeader } from "@presentation/components/layout/ObsidianHeader";
import { ModeSelectorSheet } from "@presentation/components/features/timer/ModeSelectorSheet";

import { Button } from "@presentation/components/ui/Button";

/**
 * Pantalla Principal: Pomodoro Experience.
 */
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);
  const Theme = useTheme();
  
  // Suscribimos a lo que necesitamos del Store
  const { 
    modes, 
    currentModeId, 
    time, 
    progress, 
    status,
    start,
    pause,
    reset,
    switchMode 
  } = useTimerStore();

  const { vibrationEnabled } = useSettingsStore();

  const currentMode = modes.find((m: TimerMode) => m.id === currentModeId) || modes[0];
  const isActive = status === "running";

  const handleModeChange = (modeId: string) => {
    if (vibrationEnabled) HapticService.selection();
    switchMode(modeId);
  };

  const handleStartStop = async () => {
    if (vibrationEnabled) HapticService.impactMedium();
    if (isActive) {
      pause();
    } else {
      try {
        const hasSeenWarning = await AsyncStorage.getItem("@pomodoro_seen_notif_warning");
        if (hasSeenWarning !== "true") {
          const { status } = await Notifications.getPermissionsAsync();
          if ((status as string) !== "granted" && (status as string) !== "provisional") {
            Alert.alert(
              "Notificaciones Desactivadas",
              "El temporizador Pomodoro necesita enviar notificaciones para alertarte cuando se acabe el tiempo si está en segundo plano.",
              [
                { 
                  text: "Ignorar", 
                  style: "cancel",
                  onPress: () => {
                    AsyncStorage.setItem("@pomodoro_seen_notif_warning", "true");
                    start();
                  }
                },
                {
                  text: "Ajustes",
                  onPress: () => {
                    AsyncStorage.setItem("@pomodoro_seen_notif_warning", "true");
                    Linking.openSettings();
                  }
                }
              ]
            );
            return;
          }
        }
      } catch (e) {
        // Ignorar posibles fallos de almacenamiento asíncrono
      }
      start();
    }
  };

  const handleReset = () => {
    if (vibrationEnabled) HapticService.impactMedium();
    reset();
  };

  return (
    <View style={styles.container}>
      <ObsidianHeader 
        title="POMODORO" 
        renderRight={() => (
          <Button 
            onPress={() => navigation.navigate("Settings")}
            style={styles.settingsHeaderButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons 
              name="settings-outline" 
              size={24} 
              color={currentMode?.color || Theme.colors.primary} 
            />
          </Button>
        )}
      />
      
      <View style={[styles.content, { paddingHorizontal: Theme.spacing.m }]}>
        <TimerHeader 
          currentMode={currentMode}
          onOpenSelector={() => setIsSelectorVisible(true)}
        />
        <TimerDisplay
          time={time}
          progress={progress}
          color={currentMode?.color || Theme.colors.primary}
        />
        <TimerControls
          isActive={isActive}
          handleStartStop={handleStartStop}
          handleReset={handleReset}
          color={currentMode?.color || Theme.colors.primary}
        />
      </View>

      <ModeSelectorSheet
        isVisible={isSelectorVisible}
        onClose={() => setIsSelectorVisible(false)}
        modes={modes}
        currentModeId={currentModeId}
        onSelectMode={handleModeChange}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: "100%",
  },
  settingsHeaderButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
