import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "@theme";

interface AppBackgroundProps {
  children: React.ReactNode;
  modeColor?: string; // Color opcional para teñir el degradado según el modo
}

/**
 * Componente de Fondo Maestro.
 * Proporciona un degradado de profundidad constante para toda la aplicación.
 */
export const AppBackground: React.FC<AppBackgroundProps> = ({ 
  children, 
  modeColor
}) => {
  const Theme = useTheme();

  const colors = modeColor 
    ? [modeColor + '20', Theme.colors.background] // Teñido ligeramente más fuerte para profundidad
    : [Theme.colors.background, Theme.colors.backgroundSecondary];

  return (
    <View style={[styles.container, { backgroundColor: Theme.colors.background }]}>
      <LinearGradient
        colors={colors as any}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        pointerEvents="none"
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});


