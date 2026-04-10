import AsyncStorage from "@react-native-async-storage/async-storage";
import { ITimerStateRepository } from "@domain/interfaces";
import { TimerStatus } from "@domain/timer/types";

const TIMER_STATE_KEY = "@pomodoro_active_timer_state_v1";

export interface PersistedTimerState {
  currentModeId: string;
  time: number;
  totalTime: number;
  status: TimerStatus;
  expectedEndTime: number | null;
}

export class AsyncStorageTimerRepository implements ITimerStateRepository {
  async getTimerState(): Promise<PersistedTimerState | null> {
    try {
      const json = await AsyncStorage.getItem(TIMER_STATE_KEY);
      return json ? JSON.parse(json) : null;
    } catch (e) {
      console.error("Error al cargar estado del temporizador:", e);
      return null;
    }
  }

  async saveTimerState(state: PersistedTimerState): Promise<void> {
    try {
      // Optimizamos: Guardamos en background de forma asíncrona pero sin bloquear la UI
      AsyncStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state)).catch(e => {
        console.error("Error silencioso al guardar estado del temporizador:", e);
      });
    } catch (e) {
      console.error("Error fatal al guardar estado del temporizador:", e);
    }
  }

  async clearTimerState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TIMER_STATE_KEY);
    } catch (e) {
      console.error("Error al limpiar estado del temporizador:", e);
    }
  }
}
