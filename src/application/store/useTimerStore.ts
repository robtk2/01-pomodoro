import { create } from "zustand";
import { TimerState } from "@domain/timer/types";
import { TimerMode, TimerModeId } from "@domain/modes/types";
import { calculateProgress, getNextStatus, hydrateTimeState } from "@domain/timer/logic";
import { NativeCoreTimerAdapter } from "@infrastructure/adapters/NativeCoreTimerAdapter";
import { useSettingsStore } from "./useSettingsStore";
import { AsyncStorageModeRepository } from "@infrastructure/adapters/AsyncStorageModeRepository";
import { AsyncStorageTimerRepository } from "@infrastructure/adapters/AsyncStorageTimerRepository";

const timerService = new NativeCoreTimerAdapter();
const modeRepository = new AsyncStorageModeRepository();
const timerStateRepository = new AsyncStorageTimerRepository();

const persistCurrentTimerState = (get: any) => {
  const state = get();
  timerStateRepository.saveTimerState({
    currentModeId: state.currentModeId,
    time: state.time,
    totalTime: state.totalTime,
    status: state.status,
    expectedEndTime: state.expectedEndTime
  });
};

/**
 * Store de Aplicación para el Temporizador.
 * 
 * Centraliza el estado del temporizador y los modos, proveyendo acciones
 * tipadas para la orquestación entre la UI y el Dominio.
 */
interface TimerStore extends TimerState {
  /** Lista de todos los modos de tiempo disponibles. */
  modes: TimerMode[];
  /** ID del modo que el usuario tiene seleccionado actualmente. */
  currentModeId: TimerModeId;
  
  /** Acción para actualizar la lista completa de modos (Uso interno preferentemente). */
  setModes: (modes: TimerMode[]) => void;
  /** Inicializa el temporizador fusionando los modos con la recuperación del estado persistente. */
  loadTimerState: (modes: TimerMode[]) => Promise<void>;
  /** Cambia el modo actual y resetea el temporizador. */
  switchMode: (modeId: TimerModeId) => void;
  /** Inicia la cuenta atrás. */
  start: () => void;
  /** Pausa la ejecución. */
  pause: () => void;
  /** Reinicia el tiempo al valor original del modo. */
  reset: () => void;
  /** Ejecuta el latido del reloj (decremento de tiempo). */
  tick: () => void;

  // Acciones de Gestión de Modos
  /** Guarda/Actualiza un modo en el store y persiste. */
  saveMode: (mode: TimerMode) => Promise<void>;
  /** Elimina un modo del store y persiste. */
  deleteMode: (id: string) => Promise<void>;
}


export const useTimerStore = create<TimerStore>((set, get) => ({
  // Estado inicial
  time: 1500,
  progress: 0,
  status: "idle",
  totalTime: 1500,
  expectedEndTime: null,
  modes: [],
  currentModeId: "",

  // Acciones
  setModes: (modes) => {
    const defaultMode = modes[0];
    set({ 
      modes, 
      currentModeId: defaultMode?.id || "",
      time: defaultMode?.time || 1500,
      totalTime: defaultMode?.time || 1500,
      progress: 0,
      status: "idle",
      expectedEndTime: null
    });
  },

  loadTimerState: async (modes) => {
    const fallbackMode = modes[0];
    if (!fallbackMode) return;

    const persisted = await timerStateRepository.getTimerState();
    
    // Si no hay nada guardado o la app es nueva, inicializamos de cero
    if (!persisted) {
      set({ 
        modes, 
        currentModeId: fallbackMode.id,
        time: fallbackMode.time,
        totalTime: fallbackMode.time,
        progress: 0,
        status: "idle",
        expectedEndTime: null
      });
      return;
    }

    // Resolución Matemática del Tiempo delegada al dominio
    const now = Date.now();
    const hydrated = hydrateTimeState(
      persisted.time, 
      persisted.totalTime, 
      persisted.status, 
      persisted.expectedEndTime, 
      now
    );

    // Intentamos recuperar el modo que estaba en ejecución, o recaemos en el de por defecto
    const matchedMode = modes.find(m => m.id === persisted.currentModeId) || fallbackMode;
    
    // Si el modo que estaba cacheado ya no existe, invalidamos estado y empezamos de cero en ese modo
    if (matchedMode.id !== persisted.currentModeId) {
      set({ 
        modes, 
        currentModeId: matchedMode.id,
        time: matchedMode.time,
        totalTime: matchedMode.time,
        progress: 0,
        status: "idle",
        expectedEndTime: null
      });
      persistCurrentTimerState(get);
      return;
    }

    // Inyectamos estado hidratado sin perder los modos que acaban de cargar
    set({
      modes,
      currentModeId: matchedMode.id,
      time: hydrated.time,
      totalTime: persisted.totalTime,
      progress: hydrated.progress,
      status: hydrated.status,
      expectedEndTime: hydrated.expectedEndTime
    });

    // Validamos el guardado de forma pasiva
    persistCurrentTimerState(get);
  },

  switchMode: (modeId) => {
    const mode = get().modes.find(m => m.id === modeId);
    if (mode) {
      set({
        currentModeId: modeId,
        time: mode.time,
        totalTime: mode.time,
        progress: 0,
        status: "idle",
        expectedEndTime: null
      });
      persistCurrentTimerState(get);
    }
  },

  start: () => {
    const { time, currentModeId, modes } = get();
    const mode = modes.find(m => m.id === currentModeId);
    if (!mode) return;

    // Calculamos la hora final exacta: ahora + segundos restantes
    const expectedEndTime = Date.now() + time * 1000;

    // Lógica de cascada para sonidos: Sonido del Modo -> Sonido Global
    const settings = useSettingsStore.getState();
    const soundUri = mode.soundUri || settings.defaultSound?.uri || "";

    timerService.startService(
      time,
      mode.label,
      mode.messageActive,
      mode.messageFinished,
      soundUri
    );
    
    set({ status: "running", expectedEndTime });
    persistCurrentTimerState(get);
  },
  
  pause: () => {
    timerService.stopService();
    set({ status: "paused", expectedEndTime: null });
    persistCurrentTimerState(get);
  },

  reset: () => {
    timerService.stopService();
    const mode = get().modes.find(m => m.id === get().currentModeId);
    set({
      time: mode?.time || 1500,
      totalTime: mode?.time || 1500,
      progress: 0,
      status: "idle",
      expectedEndTime: null
    });
    persistCurrentTimerState(get);
  },

  tick: () => {
    const { status, totalTime, expectedEndTime } = get();
    if (status !== "running" || !expectedEndTime) return;

    // Recalculamos el tiempo restante basándonos en el timestamp real
    const now = Date.now();
    const remainingMs = expectedEndTime - now;
    const newTime = Math.max(Math.ceil(remainingMs / 1000), 0);
    
    const newStatus = getNextStatus(newTime, status);
    const newProgress = calculateProgress(newTime, totalTime);

    set({
      time: newTime,
      status: newStatus,
      progress: newProgress,
      // Si termina, limpiamos el timestamp
      expectedEndTime: newStatus === "finished" ? null : expectedEndTime
    });

    if (newStatus === "finished") {
      persistCurrentTimerState(get);
    }
  },

  saveMode: async (mode) => {
    const { modes, currentModeId, status } = get();
    const exists = modes.find(m => m.id === mode.id);
    
    let newModes;
    if (exists) {
      newModes = modes.map(m => m.id === mode.id ? mode : m);
    } else {
      newModes = [...modes, mode];
    }
    
    // Persistimos en infra
    await modeRepository.saveModes(newModes);

    const isCurrentMode = currentModeId === mode.id;
    
    if (isCurrentMode && status === "idle") {
      // Si estamos editando el modo seleccionado y está parado, actualizamos el contador inmediatamente
      set({ 
        modes: newModes,
        time: mode.time,
        totalTime: mode.time,
        progress: 0
      });
      persistCurrentTimerState(get);
    } else if (isCurrentMode) {
      // Si está en pausa o corriendo, solo actualizamos el totalTime (afecta la barra de progreso)
      set({ modes: newModes, totalTime: mode.time });
      persistCurrentTimerState(get);
    } else {
      set({ modes: newModes });
    }
  },

  deleteMode: async (id) => {
    const { modes, currentModeId } = get();
    const newModes = modes.filter(m => m.id !== id);
    
    // Si borramos el modo actual, hay que cambiar a otro o resetear
    let nextModeId = currentModeId;
    if (currentModeId === id) {
      nextModeId = newModes[0]?.id || "";
    }
    
    await modeRepository.saveModes(newModes);
    set({ modes: newModes, currentModeId: nextModeId });
  }
}));
