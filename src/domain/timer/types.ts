/**
 * Domain Entities - Timer
 */

export type TimerStatus = "idle" | "running" | "paused" | "finished";

export interface TimerState {
  time: number; // segundos restantes
  progress: number; // 0 a 1
  status: TimerStatus;
  totalTime: number; // tiempo inicial del modo
  expectedEndTime: number | null; // timestamp de finalización
}

export interface TimerActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
}
