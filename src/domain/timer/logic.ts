/**
 * Domain Logic - Timer
 * Funciones puras para la lógica del temporizador.
 * Cero dependencias de React o Native. 100% testeable.
 */

import { TimerStatus } from "./types";

/**
 * Calcula el progreso del temporizador en un rango de 0 a 1.
 * 
 * @param {number} currentTime - Tiempo restante en segundos.
 * @param {number} totalTime - Tiempo total inicial en segundos.
 * @returns {number} Valor entre 0 (inicio) y 1 (final).
 */
export const calculateProgress = (currentTime: number, totalTime: number): number => {
  if (totalTime <= 0) return 1;
  const progress = 1 - currentTime / totalTime;
  return Math.min(Math.max(progress, 0), 1);
};

/**
 * Determina si el estado del temporizador debe cambiar basado en el tiempo restante.
 * 
 * @param {number} currentTime - Tiempo restante en segundos.
 * @param {TimerStatus} currentStatus - Estado actual del motor.
 * @returns {TimerStatus} Nuevo estado sugerido por el dominio.
 */
export const getNextStatus = (currentTime: number, currentStatus: TimerStatus): TimerStatus => {
  if (currentTime <= 0 && currentStatus === "running") {
    return "finished";
  }
  return currentStatus;
};

/**
 * Formatea una cantidad de segundos en una cadena legible MM:SS.
 * 
 * @param {number} seconds - Segundos totales a formatear.
 * @returns {string} Tiempo formateado (ej: "25:00").
 */
export const formatTimeDisplay = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Hidrata el estado del temporizador basándose en el tiempo actual y el tiempo de expiración guardado.
 * Ideal para restaurar el estado después de que la app se cerró o pasó a segundo plano.
 * 
 * @param persistedTime - Tiempo en segundos en el momento que se guardó.
 * @param persistedTotalTime - Tiempo total inicial del modo.
 * @param persistedStatus - Estado guardado ("running", "paused", "idle").
 * @param persistedExpectedEndTime - Marca de tiempo milisegundos en la que el timer debería terminar.
 * @param now - Marca de tiempo en milisegundos actual (Date.now()).
 */
export const hydrateTimeState = (
  persistedTime: number,
  persistedTotalTime: number,
  persistedStatus: TimerStatus,
  persistedExpectedEndTime: number | null,
  now: number
): { time: number; progress: number; status: TimerStatus; expectedEndTime: number | null } => {
  let newStatus = persistedStatus;
  let newTime = persistedTime;
  let newProgress = persistedTotalTime > 0 ? (persistedTotalTime - newTime) / persistedTotalTime : 0;
  let newExpectedEndTime = persistedExpectedEndTime;

  if (newStatus === "running" && persistedExpectedEndTime) {
    const remainingMs = persistedExpectedEndTime - now;
    if (remainingMs <= 0) {
      newStatus = "finished";
      newTime = 0;
      newProgress = 1;
      newExpectedEndTime = null;
    } else {
      newTime = Math.max(Math.ceil(remainingMs / 1000), 0);
      newProgress = persistedTotalTime > 0 ? (persistedTotalTime - newTime) / persistedTotalTime : 0;
    }
  }

  return {
    time: newTime,
    progress: newProgress,
    status: newStatus,
    expectedEndTime: newExpectedEndTime
  };
};
