import * as Haptics from "expo-haptics";
import { Platform, Vibration } from "react-native";

/**
 * Servicio de Feedback Háptico.
 * Centraliza las llamadas a la librería nativa para facilitar mocks y 
 * asegurar consistencia en los estilos de vibración.
 * 
 * NOTA: En Android, los estilos de Impacto de Expo pueden ser imperceptibles.
 * Por ello, usamos Vibration.vibrate(ms) como fallback de alta fiabilidad.
 */
export const HapticService = {
  /**
   * Feedback de éxito (Notificación).
   * Uso: Temporizador finalizado.
   */
  success: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  /**
   * Feedback de impacto medio.
   * Uso: Clicks en botones principales (Start/Pause).
   */
  impactMedium: async () => {
    if (Platform.OS === "android") {
      Vibration.vibrate(80); // 80ms es un pulso firme y premium
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },

  /**
   * Feedback de impacto ligero.
   * Uso: Latido del reloj (tick), micro-interacciones.
   */
  impactLight: async () => {
    if (Platform.OS === "android") {
      Vibration.vibrate(30); // 30ms es un latido sutil
    } else {
      await Haptics.selectionAsync();
    }
  },

  /**
   * Feedback de selección.
   * Uso: Cambio de modo en seletores, sliders.
   */
  selection: async () => {
    if (Platform.OS === "android") {
      Vibration.vibrate(40);
    } else {
      await Haptics.selectionAsync();
    }
  },

  /**
   * Feedback de error.
   */
  error: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
};
