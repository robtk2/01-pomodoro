import { useState } from "react";
import { useTimerStore } from "@application/store/useTimerStore";
import { HapticService } from "@infrastructure/services/HapticService";
import { TimerMode } from "@domain/modes/types";
import { Alert } from "react-native";

/**
 * Hook de Aplicación - Lógica del Formulario de Edición de Modos.
 * Desacopla la gestión del estado, validación y persistencia de la interfaz.
 */
export const useEditModeForm = (initialMode?: TimerMode, onSaveSuccess?: () => void) => {
  const { saveMode } = useTimerStore();

  const [form, setForm] = useState<TimerMode>({
    id: initialMode?.id || Date.now().toString(),
    label: initialMode?.label || "",
    time: initialMode?.time || 25 * 60,
    color: initialMode?.color || "#F06292",
    icon: initialMode?.icon || "timer",
    messageActive: initialMode?.messageActive || "En curso...",
    messageFinished: initialMode?.messageFinished || "¡Terminado!",
    soundUri: initialMode?.soundUri || "",
  });

  // Auxiliares para el manejo de tiempo en la UI
  const [minutes, setMinutes] = useState(
    Math.floor(form.time / 60).toString()
  );
  const [seconds, setSeconds] = useState(
    (form.time % 60).toString()
  );

  const updateField = (field: keyof TimerMode, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Feedback suave al interactuar
    if (field === "color" || field === "icon") {
      HapticService.selection();
    }
  };

  const handleSave = async () => {
    // 1. Validaciones
    if (!form.label.trim()) {
      HapticService.error();
      Alert.alert("Error", "El nombre del modo es obligatorio");
      return;
    }

    const min = parseInt(minutes) || 0;
    const sec = parseInt(seconds) || 0;
    const finalTime = min * 60 + sec;

    if (finalTime <= 0) {
      HapticService.error();
      Alert.alert("Error", "El tiempo debe ser mayor que cero");
      return;
    }

    // 2. Preparar objeto final
    const modeToSave: TimerMode = {
      ...form,
      time: finalTime,
    };

    // 3. Persistir y Feedback
    try {
      await saveMode(modeToSave);
      HapticService.success();
      if (onSaveSuccess) onSaveSuccess();
    } catch (error) {
      HapticService.error();
      Alert.alert("Error", "No se pudo guardar el modo");
    }
  };

  return {
    form,
    minutes,
    seconds,
    setMinutes,
    setSeconds,
    updateField,
    handleSave,
  };
};
