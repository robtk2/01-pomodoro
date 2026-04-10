/**
 * Design Tokens - Colors (Obsidian vs Quartz)
 */

export const DarkColors = {
  // Acentos de Estado
  primary: "#00F5FF",       // Cyan Neón
  secondary: "#FF4D6D",     // Coral
  accent: "#FFB000",        // Oro
  
  // Fondos Profundos "Obsidian"
  background: "#080809",
  backgroundSecondary: "#0F0F11",
  
  // Superficies Glassmorphism
  surface: "rgba(255, 255, 255, 0.06)",
  surfaceSecondary: "rgba(255, 255, 255, 0.12)",
  surfaceTertiary: "rgba(255, 255, 255, 0.2)",
  
  // Estados y Funcionalidad
  success: "#00FFAB",
  warning: "#FFFB00",
  danger: "#FF2E63",
  info: "#42C2FF",

  // Tipografía Premium
  text: "#FFFFFF",
  textSecondary: "#A0A0A5",
  textTertiary: "#636366",
  textInverted: "#000000",

  // Efectos de Borde y Brillo
  border: "rgba(255, 255, 255, 0.1)",
  borderLight: "rgba(255, 255, 255, 0.2)",
  glow: "rgba(0, 245, 255, 0.3)",
} as const;

export const LightColors = {
  // Acentos de Estado (Ligeramente más saturados para legibilidad en blanco)
  primary: "#00B4D8",       // Azul Océano Profundo
  secondary: "#EF476F",     // Rubí Suave
  accent: "#F59E0B",        // Ámbar
  
  // Fondos Claros "Quartz"
  background: "#F8F9FA",    // Blanco Hielo
  backgroundSecondary: "#E9ECEF",
  
  // Superficies Frosted Glass (Efecto cristal esmerilado blanco sobre luz)
  surface: "rgba(255, 255, 255, 0.4)",
  surfaceSecondary: "rgba(255, 255, 255, 0.6)",
  surfaceTertiary: "rgba(255, 255, 255, 0.8)",
  
  // Estados y Funcionalidad
  success: "#06D6A0",
  warning: "#FFD166",
  danger: "#EF476F",
  info: "#118AB2",

  // Tipografía Carbón
  text: "#1A1A1E",
  textSecondary: "#495057",
  textTertiary: "#adb5bd",
  textInverted: "#FFFFFF",

  // Efectos de Borde y Brillo
  border: "rgba(0, 0, 0, 0.15)",
  borderLight: "rgba(0, 0, 0, 0.25)",
  glow: "rgba(0, 180, 216, 0.2)",
} as const;

// Exportamos la interfaz común para el sistema de tipos
export interface AppColors {
  readonly primary: string;
  readonly secondary: string;
  readonly accent: string;
  readonly background: string;
  readonly backgroundSecondary: string;
  readonly surface: string;
  readonly surfaceSecondary: string;
  readonly surfaceTertiary: string;
  readonly success: string;
  readonly warning: string;
  readonly danger: string;
  readonly info: string;
  readonly text: string;
  readonly textSecondary: string;
  readonly textTertiary: string;
  readonly textInverted: string;
  readonly border: string;
  readonly borderLight: string;
  readonly glow: string;
}

export const Colors: AppColors = DarkColors;

