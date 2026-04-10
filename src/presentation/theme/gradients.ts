import { DarkColors, LightColors } from "./colors";

/**
 * Design Tokens - Gradients
 */

export const DarkGradients = {
  // Fondo maestro de la aplicación
  main: [DarkColors.background, DarkColors.backgroundSecondary],
  
  // Estados del temporizador
  focus: ["#00F5FF", "#00A8FF"],
  shortBreak: ["#FF4D6D", "#D00036"],
  longBreak: ["#FFB000", "#FF8C00"],
  
  // Efectos de superficie
  glass: ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.02)"],
  darkOverlay: ["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.4)"],
} as const;

export const LightGradients = {
  // Fondo maestro de la aplicación
  main: [LightColors.background, LightColors.backgroundSecondary],
  
  // Estados del temporizador (Ligeramente ajustados para fondos claros)
  focus: ["#00B4D8", "#0077B6"],
  shortBreak: ["#EF476F", "#C01035"],
  longBreak: ["#F59E0B", "#D97706"],
  
  // Efectos de superficie
  glass: ["rgba(0, 0, 0, 0.05)", "rgba(0, 0, 0, 0.01)"],
  darkOverlay: ["rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.3)"],
} as const;

export interface AppGradients {
  readonly main: readonly string[];
  readonly focus: readonly string[];
  readonly shortBreak: readonly string[];
  readonly longBreak: readonly string[];
  readonly glass: readonly string[];
  readonly darkOverlay: readonly string[];
}

export const Gradients: AppGradients = DarkGradients;

