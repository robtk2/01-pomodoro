/**
 * Domain Entities - Modes
 * Define el contrato base de lo que es un "Modo de Temporizador"
 */

export interface TimerMode {
  id: string;
  label: string;
  time: number; // en segundos
  color: string;
  icon: string;
  messageActive: string;
  messageFinished: string;
  soundUri?: string;
}

export type TimerModeId = string;

export interface ModeState {
  modes: TimerMode[];
  currentModeId: TimerModeId;
}
