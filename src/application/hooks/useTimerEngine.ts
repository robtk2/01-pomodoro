import { useEffect, useRef } from "react";
import { useTimerStore } from "@application/store/useTimerStore";
import { useSettingsStore } from "@application/store/useSettingsStore";
import { HapticService } from "@infrastructure/services/HapticService";
import CoreTimer from "@modules/core-timer";

/**
 * Hook de Aplicación - Motor del Temporizador
 * Controla el latido (tick) del temporizador globalmente y el feedback físico.
 */
export const useTimerEngine = () => {
  const { status, time, tick } = useTimerStore();
  const { vibrationEnabled, hapticPulseEnabled, hapticPulseDuration } = useSettingsStore();
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (status === "running") {
      // Iniciamos el latido cada 1 segundo
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      // Limpiamos si no está en marcha
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, tick]);

  // Efecto para el feedback háptico del "Latido" (Tick a Tick)
  useEffect(() => {
    if (status === "running" && vibrationEnabled && hapticPulseEnabled) {
      if (time <= hapticPulseDuration && time > 0) {
        HapticService.impactLight();
      }
    }
  }, [time, status, vibrationEnabled, hapticPulseEnabled, hapticPulseDuration]);

  useEffect(() => {
    // Escuchamos el evento nativo de "Temporizador Finalizado"
    const subscription = CoreTimer.addListener("onTimerFinished", () => {
      // Feedback háptico de éxito al terminar
      if (vibrationEnabled) {
        HapticService.success();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [vibrationEnabled]);
};

