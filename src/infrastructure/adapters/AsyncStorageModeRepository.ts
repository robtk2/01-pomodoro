import AsyncStorage from "@react-native-async-storage/async-storage";
import { TimerMode } from "@domain/modes/types";
import { IModeRepository } from "@domain/interfaces";

const MODES_KEY = "@pomodoro_modes_v2";

export class AsyncStorageModeRepository implements IModeRepository {
  private defaultModes: TimerMode[] = [
    {
      id: "pomodoro",
      label: "Pomodoro",
      time: 25 * 60,
      color: "#F06292",
      icon: "timer",
      messageActive: "En curso...",
      messageFinished: "¡Terminado!"
    },
    {
      id: "short-break",
      label: "Descanso Corto",
      time: 5 * 60,
      color: "#4DB6AC",
      icon: "cafe",
      messageActive: "Descansando...",
      messageFinished: "¡A trabajar!"
    },
    {
      id: "long-break",
      label: "Descanso Largo",
      time: 15 * 60,
      color: "#81C784",
      icon: "cafe",
      messageActive: "Descanso profundo...",
      messageFinished: "¡Vuelve a la carga!"
    }
  ];

  async getModes(): Promise<TimerMode[]> {
    try {
      const json = await AsyncStorage.getItem(MODES_KEY);
      return json ? JSON.parse(json) : this.resetToDefaults();
    } catch (e) {
      console.error("Error al cargar modos:", e);
      return this.defaultModes;
    }
  }

  async saveModes(modes: TimerMode[]): Promise<void> {
    try {
      await AsyncStorage.setItem(MODES_KEY, JSON.stringify(modes));
    } catch (e) {
      console.error("Error al guardar modos:", e);
    }
  }

  async resetToDefaults(): Promise<TimerMode[]> {
    await this.saveModes(this.defaultModes);
    return this.defaultModes;
  }
}
