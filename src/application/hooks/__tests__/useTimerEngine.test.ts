import { renderHook } from "@testing-library/react-native";
import { useTimerEngine } from "../useTimerEngine";
import { useTimerStore } from "@application/store/useTimerStore";
import { useSettingsStore } from "@application/store/useSettingsStore";
import { HapticService } from "@infrastructure/services/HapticService";
import CoreTimer from "@modules/core-timer";

jest.mock("@application/store/useTimerStore");
jest.mock("@application/store/useSettingsStore");
jest.mock("@infrastructure/services/HapticService");
jest.mock("@modules/core-timer", () => ({
  addListener: jest.fn(),
}));

describe("useTimerEngine", () => {
  let mockTick: jest.Mock;
  let mockRemoveSubscription: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    mockTick = jest.fn();
    (useTimerStore as unknown as jest.Mock).mockReturnValue({
      status: "idle",
      time: 1500,
      tick: mockTick,
    });

    (useSettingsStore as unknown as jest.Mock).mockReturnValue({
      vibrationEnabled: true,
      hapticPulseEnabled: true,
      hapticPulseDuration: 10,
    });

    mockRemoveSubscription = jest.fn();
    (CoreTimer.addListener as jest.Mock).mockReturnValue({
      remove: mockRemoveSubscription,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("configura el intervalo de latido cuando status es 'running'", () => {
    (useTimerStore as unknown as jest.Mock).mockReturnValue({
      status: "running",
      time: 1500,
      tick: mockTick,
    });

    renderHook(() => useTimerEngine());

    // Avanza 1 segundo
    jest.advanceTimersByTime(1000);
    expect(mockTick).toHaveBeenCalledTimes(1);

    // Avanza 2 segundos más
    jest.advanceTimersByTime(2000);
    expect(mockTick).toHaveBeenCalledTimes(3);
  });

  test("limpia el intervalo cuando status cambia a distinto de 'running'", () => {
    const { rerender } = renderHook(() => useTimerEngine());

    (useTimerStore as unknown as jest.Mock).mockReturnValue({
      status: "running",
      time: 1500,
      tick: mockTick,
    });
    
    // Forzamos rerender simulando que el store cambió el status
    rerender({});
    jest.advanceTimersByTime(1000);
    expect(mockTick).toHaveBeenCalledTimes(1);

    // Cambiamos estado de vuelta
    (useTimerStore as unknown as jest.Mock).mockReturnValue({
      status: "paused",
      time: 1499,
      tick: mockTick,
    });
    rerender({});

    jest.advanceTimersByTime(1000);
    expect(mockTick).toHaveBeenCalledTimes(1); // No debió llamarse de nuevo
  });

  test("hace latido háptico si time <= hapticPulseDuration", () => {
    (useTimerStore as unknown as jest.Mock).mockReturnValue({
      status: "running",
      time: 5, // <= 10
      tick: mockTick,
    });

    const { rerender } = renderHook(() => useTimerEngine());
    
    // El efecto se dispara al montar si cumple condición
    expect(HapticService.impactLight).toHaveBeenCalledTimes(1);

    // No debe vibrar en el segundo 0
    (useTimerStore as unknown as jest.Mock).mockReturnValue({
      status: "running",
      time: 0,
      tick: mockTick,
    });
    rerender({});
    expect(HapticService.impactLight).toHaveBeenCalledTimes(1); // Mismo conteo
  });

  test("escucha evento nativo 'onTimerFinished' y vibra", () => {
    renderHook(() => useTimerEngine());

    // listener(eventName, callback)
    const callback = (CoreTimer.addListener as jest.Mock).mock.calls[0][1];
    expect((CoreTimer.addListener as jest.Mock).mock.calls[0][0]).toBe("onTimerFinished");
    
    // Ejecutamos el callback simulando el modulo nativo
    callback();

    expect(HapticService.success).toHaveBeenCalledTimes(1);
  });

  test("limpia suscripcion al desmontar el componente", () => {
    const { unmount } = renderHook(() => useTimerEngine());
    unmount();
    expect(mockRemoveSubscription).toHaveBeenCalled();
  });
});
