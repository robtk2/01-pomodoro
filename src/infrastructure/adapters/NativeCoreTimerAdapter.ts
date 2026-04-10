import CoreTimer from "@modules/core-timer";
import { ITimerService } from "@domain/interfaces";

/**
 * Adaptador de Infraestructura para el módulo nativo CoreTimer.
 * Implementa el contrato ITimerService para desacoplar la lógica nativa del dominio.
 */
export class NativeCoreTimerAdapter implements ITimerService {
  
  /**
   * Inicia el servicio nativo de primer plano (Foreground Service).
   * @param remainingSeconds Segundos restantes para el temporizador.
   * @param title Título de la notificación.
   * @param bodyActive Mensaje mientras el tiempo corre.
   * @param bodyFinished Mensaje cuando el tiempo termina.
   * @param soundUri URI del sonido de alarma (opcional).
   */
  async startService(
    remainingSeconds: number,
    title: string,
    bodyActive: string,
    bodyFinished: string,
    soundUri: string = ""
  ): Promise<void> {
    try {
      // Calculamos el timestamp objetivo (momento exacto en que debe terminar)
      const targetTime = Date.now() + remainingSeconds * 1000;
      
      await CoreTimer.startService(
        targetTime,
        title,
        bodyActive,
        bodyFinished,
        soundUri
      );
    } catch (error) {
      console.error("[NativeCoreTimerAdapter] Error starting service:", error);
    }
  }

  /**
   * Detiene el servicio nativo y elimina la notificación.
   */
  async stopService(): Promise<void> {
    try {
      await CoreTimer.stopService();
    } catch (error) {
      console.error("[NativeCoreTimerAdapter] Error stopping service:", error);
    }
  }

  /**
   * Obtiene la lista de sonidos de notificación disponibles en el sistema Android.
   */
  async getSystemSounds(): Promise<{ name: string; uri: string }[]> {
    try {
      return await CoreTimer.getSystemSounds();
    } catch (error) {
      console.error("[NativeCoreTimerAdapter] Error fetching system sounds:", error);
      return [];
    }
  }
}
