import { TimerMode } from "../domain/modes/types";

/**
 * Interfaz para el repositorio de Modos.
 * Cualquier implementación (AsyncStorage, SQLite) debe cumplir este contrato.
 */
export interface IModeRepository {
  getModes(): Promise<TimerMode[]>;
  saveModes(modes: TimerMode[]): Promise<void>;
  resetToDefaults(): Promise<TimerMode[]>;
}

/**
 * Interfaz para la configuración de la App.
 */
export interface ISettingsRepository {
  getVibrationEnabled(): Promise<boolean>;
  setVibrationEnabled(enabled: boolean): Promise<void>;
  getSelectedSound(): Promise<any>;
  setSelectedSound(sound: any): Promise<void>;
  getHapticPulseEnabled(): Promise<boolean>;
  setHapticPulseEnabled(enabled: boolean): Promise<void>;
  getHapticPulseDuration(): Promise<number>;
  setHapticPulseDuration(duration: number): Promise<void>;
  getThemeMode(): Promise<"dark" | "light">;
  setThemeMode(mode: "dark" | "light"): Promise<void>;
}

/**
 * Interfaz para el servicio de temporizador nativo (Android Foreground Service).
 */
export interface ITimerService {
  startService(
    targetTime: number,
    title: string,
    bodyActive: string,
    bodyFinished: string,
    soundUri: string
  ): Promise<void>;
  stopService(): Promise<void>;
  getSystemSounds(): Promise<{ name: string; uri: string }[]>;
}

/**
 * Interfaz para el repositorio de estado activo del temporizador.
 */
export interface ITimerStateRepository {
  getTimerState(): Promise<any>;
  saveTimerState(state: any): Promise<void>;
  clearTimerState(): Promise<void>;
}
