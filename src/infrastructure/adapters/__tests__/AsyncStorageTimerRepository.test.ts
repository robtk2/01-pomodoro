import { AsyncStorageTimerRepository, PersistedTimerState } from "../AsyncStorageTimerRepository";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe("AsyncStorageTimerRepository", () => {
  let repository: AsyncStorageTimerRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new AsyncStorageTimerRepository();
  });

  test("getTimerState() devuelve estado parseado", async () => {
    const state: PersistedTimerState = {
      currentModeId: "test",
      time: 100,
      totalTime: 200,
      status: "running",
      expectedEndTime: 1000
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(state));
    
    expect(await repository.getTimerState()).toEqual(state);
  });

  test("getTimerState() devuelve null si no hay datos", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    expect(await repository.getTimerState()).toBeNull();
  });

  test("getTimerState() devuelve null en error y no lanza excepcion", async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error());
    const spy = jest.spyOn(console, "error").mockImplementation();
    
    expect(await repository.getTimerState()).toBeNull();
    spy.mockRestore();
  });

  test("saveTimerState() lanza guardado en background asincrono", async () => {
    const state: PersistedTimerState = {
      currentModeId: "test",
      time: 100,
      totalTime: 200,
      status: "running",
      expectedEndTime: 1000
    };
    
    // Al ser un catch asincrono no-await, verificamos al menos el call
    await repository.saveTimerState(state);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@pomodoro_active_timer_state_v1", JSON.stringify(state));
  });

  test("saveTimerState() maneja el catch asincrono de la promesa", async () => {
    // Simulamos que el setItem falla pero asincronamente
    const rejectedPromise = Promise.reject(new Error("Async Error"));
    (AsyncStorage.setItem as jest.Mock).mockReturnValueOnce(rejectedPromise);
    const spy = jest.spyOn(console, "error").mockImplementation();

    await repository.saveTimerState(null as any);
    
    // Esperamos al tick de promesas para que se ejecute el .catch() encapsulado
    await Promise.resolve();
    
    expect(spy).toHaveBeenCalledWith("Error silencioso al guardar estado del temporizador:", expect.any(Error));
    spy.mockRestore();
  });

  test("saveTimerState() atrapa error fatal sincrono", async () => {
    // JSON.stringify sobre un objeto con referencia circular arroja error sincrono
    const circularObj: any = {};
    circularObj.self = circularObj;
    
    const spy = jest.spyOn(console, "error").mockImplementation();

    await repository.saveTimerState(circularObj);
    
    expect(spy).toHaveBeenCalledWith("Error fatal al guardar estado del temporizador:", expect.any(Error));
    spy.mockRestore();
  });

  test("clearTimerState() limpia el item", async () => {
    await repository.clearTimerState();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@pomodoro_active_timer_state_v1");
  });

  test("clearTimerState() atrapa excepciones", async () => {
    (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error());
    const spy = jest.spyOn(console, "error").mockImplementation();

    await repository.clearTimerState();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
