import { create } from "zustand";
import { AsyncStorageSettingsRepository } from "@infrastructure/adapters/AsyncStorageSettingsRepository";
import { NativeCoreTimerAdapter } from "@infrastructure/adapters/NativeCoreTimerAdapter";
import { audioPreviewService } from "@infrastructure/services/AudioPreviewService";

const settingsRepository = new AsyncStorageSettingsRepository();
const timerService = new NativeCoreTimerAdapter();

interface SettingsState {
  vibrationEnabled: boolean;
  hapticPulseEnabled: boolean;
  hapticPulseDuration: number;
  defaultSound: { name: string; uri: string } | null;
  availableSounds: { name: string; uri: string }[];
  themeMode: "dark" | "light";
  isLoading: boolean;
  
  // Acciones
  loadSettings: () => Promise<void>;
  setVibrationEnabled: (enabled: boolean) => Promise<void>;
  setHapticPulseEnabled: (enabled: boolean) => Promise<void>;
  setHapticPulseDuration: (duration: number) => Promise<void>;
  setDefaultSound: (sound: { name: string; uri: string } | null) => Promise<void>;
  setThemeMode: (mode: "dark" | "light") => Promise<void>;
  loadAvailableSounds: () => Promise<void>;
  
  /** Reproduce un sonido de prueba. */
  playSoundPreview: (uri: string) => Promise<void>;
  /** Detiene cualquier sonido que esté sonando. */
  stopSoundPreview: () => Promise<void>;
}

/**
 * Store de Aplicación para gestionar la configuración global.
 * Sigue los principios de responsabilidad única, separando los ajustes del temporizador.
 */
export const useSettingsStore = create<SettingsState>((set, get) => ({
  vibrationEnabled: true,
  hapticPulseEnabled: false,
  hapticPulseDuration: 10,
  defaultSound: null,
  availableSounds: [],
  themeMode: "dark",
  isLoading: true,

  loadSettings: async () => {
    set({ isLoading: true });
    const vibration = await settingsRepository.getVibrationEnabled();
    const hapticPulse = await settingsRepository.getHapticPulseEnabled();
    const hapticDuration = await settingsRepository.getHapticPulseDuration();
    const sound = await settingsRepository.getSelectedSound();
    const theme = await settingsRepository.getThemeMode();
    
    set({ 
      vibrationEnabled: vibration, 
      hapticPulseEnabled: hapticPulse,
      hapticPulseDuration: hapticDuration,
      defaultSound: sound, 
      themeMode: theme,
      isLoading: false 
    });
  },

  setVibrationEnabled: async (enabled: boolean) => {
    await settingsRepository.setVibrationEnabled(enabled);
    set({ vibrationEnabled: enabled });
  },

  setHapticPulseEnabled: async (enabled: boolean) => {
    await settingsRepository.setHapticPulseEnabled(enabled);
    set({ hapticPulseEnabled: enabled });
  },

  setHapticPulseDuration: async (duration: number) => {
    await settingsRepository.setHapticPulseDuration(duration);
    set({ hapticPulseDuration: duration });
  },

  setDefaultSound: async (sound) => {
    await settingsRepository.setSelectedSound(sound);
    set({ defaultSound: sound });
  },
  
  setThemeMode: async (mode: "dark" | "light") => {
    await settingsRepository.setThemeMode(mode);
    set({ themeMode: mode });
  },

  loadAvailableSounds: async () => {
    if (get().availableSounds.length > 0) return;
    
    set({ isLoading: true });
    try {
      const sounds = await timerService.getSystemSounds();
      set({ availableSounds: sounds, isLoading: false });
    } catch (error) {
      console.error("Error loading sounds:", error);
      set({ isLoading: false });
    }
  },

  playSoundPreview: async (uri: string) => {
    try {
      await audioPreviewService.playSoundPreview(uri);
    } catch (error) {
      console.error("Error playing preview:", error);
    }
  },

  stopSoundPreview: async () => {
    await audioPreviewService.stopSoundPreview();
  }
}));

