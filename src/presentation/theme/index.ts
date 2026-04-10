import { useMemo } from "react";
import { DarkColors, LightColors, AppColors } from "./colors";
import { Spacing } from "./spacing";
import { DarkGradients, LightGradients, Gradients } from "./gradients";
import { Typography } from "./typography";
import { useSettingsStore } from "@application/store/useSettingsStore";
import { AppGradients } from "./gradients";

/**
 * Interface del Sistema de Diseño
 */
export interface AppTheme {
  colors: AppColors;
  spacing: typeof Spacing;
  typography: typeof Typography;
  gradients: AppGradients;
  roundness: number;
  mode: "dark" | "light";
}

/**
 * Hook central para acceder al tema de forma reactiva.
 * Siempre debe usarse dentro de un componente de React.
 */
export const useTheme = (): AppTheme => {
  const themeMode = useSettingsStore((state) => state.themeMode);

  return useMemo(() => ({
    colors: themeMode === "dark" ? DarkColors : LightColors,
    gradients: themeMode === "dark" ? DarkGradients : LightGradients,
    spacing: Spacing,
    typography: Typography,
    roundness: 24,
    mode: themeMode,
  }), [themeMode]);
};

// Exportamos los tokens estáticos (útiles para fuera de componentes si es necesario, por defecto oscuro)
export const Theme = {
  colors: DarkColors,
  spacing: Spacing,
  typography: Typography,
  gradients: Gradients,
  roundness: 24,
};

export { DarkColors, LightColors, Spacing, Typography, Gradients };
export default Theme;
