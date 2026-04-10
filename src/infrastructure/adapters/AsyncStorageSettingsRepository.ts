import AsyncStorage from "@react-native-async-storage/async-storage";
import { ISettingsRepository } from "@domain/interfaces";

const SETTINGS_KEYS = {
  VIBRATION: "@pomodoro_vibration",
  DEFAULT_SOUND: "@pomodoro_default_sound",
  HAPTIC_PULSE: "@pomodoro_haptic_pulse",
  HAPTIC_PULSE_DURATION: "@pomodoro_haptic_pulse_duration",
  THEME_MODE: "@pomodoro_theme_mode",
};

/**
 * Repositorio de Infraestructura para persistir los ajustes de la App.
 * Utiliza AsyncStorage para almacenamiento local sencillo y persistente.
 */
export class AsyncStorageSettingsRepository implements ISettingsRepository {
  
  async getVibrationEnabled(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(SETTINGS_KEYS.VIBRATION);
      return value !== null ? JSON.parse(value) : true; // Por defecto true
    } catch {
      return true;
    }
  }

  async setVibrationEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(SETTINGS_KEYS.VIBRATION, JSON.stringify(enabled));
  }

  async getSelectedSound(): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(SETTINGS_KEYS.DEFAULT_SOUND);
      return value !== null ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  async setSelectedSound(sound: any): Promise<void> {
    await AsyncStorage.setItem(SETTINGS_KEYS.DEFAULT_SOUND, JSON.stringify(sound));
  }

  async getHapticPulseEnabled(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(SETTINGS_KEYS.HAPTIC_PULSE);
      return value !== null ? JSON.parse(value) : false; // Por defecto false
    } catch {
      return false;
    }
  }

  async setHapticPulseEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(SETTINGS_KEYS.HAPTIC_PULSE, JSON.stringify(enabled));
  }

  async getHapticPulseDuration(): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(SETTINGS_KEYS.HAPTIC_PULSE_DURATION);
      return value !== null ? JSON.parse(value) : 10; // Por defecto 10
    } catch {
      return 10;
    }
  }

  async setHapticPulseDuration(duration: number): Promise<void> {
    await AsyncStorage.setItem(SETTINGS_KEYS.HAPTIC_PULSE_DURATION, JSON.stringify(duration));
  }

  async getThemeMode(): Promise<"dark" | "light"> {
    try {
      const value = await AsyncStorage.getItem(SETTINGS_KEYS.THEME_MODE);
      return (value as "dark" | "light") || "dark";
    } catch {
      return "dark";
    }
  }

  async setThemeMode(mode: "dark" | "light"): Promise<void> {
    await AsyncStorage.setItem(SETTINGS_KEYS.THEME_MODE, mode);
  }
}
