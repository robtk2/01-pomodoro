import { calculateProgress, getNextStatus, formatTimeDisplay, hydrateTimeState } from "@domain/timer/logic";

describe("Timer Domain Logic", () => {
  
  describe("calculateProgress", () => {
    test("debe calcular el progreso correctamente al 50%", () => {
      expect(calculateProgress(15, 30)).toBe(0.5);
    });

    test("debe devolver 1 cuando el tiempo restante es 0", () => {
      expect(calculateProgress(0, 30)).toBe(1);
    });

    test("debe devolver 0 cuando el tiempo restante es igual al total", () => {
      expect(calculateProgress(30, 30)).toBe(0);
    });

    test("debe estar capeado entre 0 y 1", () => {
      expect(calculateProgress(40, 30)).toBe(0);
      expect(calculateProgress(-5, 30)).toBe(1);
    });
  });

  describe("getNextStatus", () => {
    test("debe cambiar a 'finished' cuando el tiempo llega a 0 y está corriendo", () => {
      expect(getNextStatus(0, "running")).toBe("finished");
    });

    test("debe devolver 'finished' si el tiempo es negativo y está corriendo", () => {
      expect(getNextStatus(-1, "running")).toBe("finished");
    });

    test("no debe cambiar a 'finished' si ya estaba en 'idle'", () => {
      expect(getNextStatus(0, "idle")).toBe("idle");
    });

    test("debe mantener 'running' si queda tiempo", () => {
      expect(getNextStatus(10, "running")).toBe("running");
    });
  });

  describe("formatTimeDisplay", () => {
    test("debe formatear segundos a MM:SS correctamente", () => {
      expect(formatTimeDisplay(65)).toBe("01:05");
      expect(formatTimeDisplay(3600)).toBe("60:00");
      expect(formatTimeDisplay(9)).toBe("00:09");
      expect(formatTimeDisplay(0)).toBe("00:00");
    });

    test("debe manejar más de 99 minutos correctamente", () => {
      expect(formatTimeDisplay(6000)).toBe("100:00");
    });
  });

  describe("hydrateTimeState", () => {
    test("debe devolver el mismo estado si no estaba corriendo ni hay expectedEndTime", () => {
      const result = hydrateTimeState(1500, 1500, "idle", null, Date.now());
      expect(result).toEqual({ time: 1500, progress: 0, status: "idle", expectedEndTime: null });
    });

    test("debe recalcular si estaba corriendo y el tiempo restante es positivo", () => {
      const now = Date.now();
      const expectedEndTime = now + 10000; // Faltan 10 segundos
      const result = hydrateTimeState(20, 1500, "running", expectedEndTime, now);
      
      expect(result.time).toBe(10); // 10000ms a segundos
      expect(result.status).toBe("running");
      expect(result.expectedEndTime).toBe(expectedEndTime);
      expect(result.progress).toBeCloseTo((1500 - 10) / 1500);
    });

    test("debe marcar como 'finished' si el tiempo ya pasó", () => {
      const now = Date.now();
      const expectedEndTime = now - 5000; // Pasó hace 5 segundos
      const result = hydrateTimeState(20, 1500, "running", expectedEndTime, now);
      
      expect(result).toEqual({
        time: 0,
        progress: 1,
        status: "finished",
        expectedEndTime: null
      });
    });
  });

});
