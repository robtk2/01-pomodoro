import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from "@theme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
}

/**
 * GlassCard - Componente núcleo del diseño "Obsidian Glass".
 * Aplica un efecto de desenfoque de fondo y bordes translúcidos.
 */
export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  style,
  contentStyle,
  intensity = 30,
  tint 
}) => {
  const Theme = useTheme();
  const isDark = Theme.mode === 'dark';
  
  // Si no se especifica tint, usamos el modo del tema actual
  const activeTint = tint || (isDark ? 'dark' : 'light');

  return (
    <View 
      style={[
        styles.container, 
        { 
          borderRadius: Theme.roundness,
          borderColor: Theme.colors.border,
          // En modo claro usamos un blanco traslúcido para el efecto Quartz
          // En modo oscuro usamos un negro traslúcido para Obsidian
          backgroundColor: isDark 
            ? 'rgba(255, 255, 255, 0.03)' 
            : 'rgba(255, 255, 255, 0.4)'
        },
        style
      ]}
    >
      <BlurView 
        intensity={intensity} 
        tint={activeTint} 
        style={StyleSheet.absoluteFill} 
      />
      <View style={[styles.content, { padding: Theme.spacing.m }, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  content: {
    backgroundColor: 'transparent',
  },
});
