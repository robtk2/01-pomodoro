const mockAdapter = {
  startService: jest.fn(),
  stopService: jest.fn(),
  getSystemSounds: jest.fn(() => Promise.resolve([])),
};

jest.mock("@infrastructure/adapters/NativeCoreTimerAdapter", () => ({
  NativeCoreTimerAdapter: jest.fn().mockImplementation(() => mockAdapter),
}));

const mockGetTimerState = jest.fn();
const mockSaveTimerState = jest.fn();
jest.mock("@infrastructure/adapters/AsyncStorageTimerRepository", () => ({
  AsyncStorageTimerRepository: jest.fn().mockImplementation(() => ({
    getTimerState: mockGetTimerState,
    saveTimerState: mockSaveTimerState,
  })),
}));

const mockSaveModes = jest.fn();
jest.mock("@infrastructure/adapters/AsyncStorageModeRepository", () => ({
  AsyncStorageModeRepository: jest.fn().mockImplementation(() => ({
    saveModes: mockSaveModes,
  })),
}));

// Cargamos el store de forma diferida para asegurar que los mocks estén activos
const getStore = () => require("../useTimerStore").useTimerStore;

describe("useTimerStore", () => {
  const mockModes = [
    { id: "1", label: "Pomodoro", time: 1500, icon: "timer", color: "red", messageActive: "Studying", messageFinished: "Take a break" },
    { id: "2", label: "Short Break", time: 300, icon: "coffee", color: "green", messageActive: "Resting", messageFinished: "Back to work" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset del store a su estado inicial antes de cada test
    getStore().setState({
      time: 1500,
      progress: 0,
      status: "idle",
      totalTime: 1500,
      expectedEndTime: null,
      modes: [],
      currentModeId: "",
    });
  });

  test("debe inicializar los modos correctamente", () => {
    const { setModes } = getStore().getState();
    setModes(mockModes);

    const state = getStore().getState();
    expect(state.modes).toHaveLength(2);
    expect(state.currentModeId).toBe("1");
    expect(state.time).toBe(1500);
  });

  test("loadTimerState(): debe inicializar desde cero si no hay persistencia", async () => {
    mockGetTimerState.mockResolvedValueOnce(null);
    await getStore().getState().loadTimerState(mockModes);

    const state = getStore().getState();
    expect(state.currentModeId).toBe("1"); // fallbackMode (0)
    expect(state.time).toBe(1500);
  });

  test("loadTimerState(): debe saltar si no le pasan modos", async () => {
    await getStore().getState().loadTimerState([]);
    expect(mockGetTimerState).not.toHaveBeenCalled();
  });

  test("loadTimerState(): debe cargar estado pausado correctamente", async () => {
    mockGetTimerState.mockResolvedValueOnce({
      currentModeId: "2",
      time: 150,
      totalTime: 300,
      status: "paused",
      expectedEndTime: null
    });

    await getStore().getState().loadTimerState(mockModes);

    const state = getStore().getState();
    expect(state.currentModeId).toBe("2");
    expect(state.time).toBe(150);
    expect(state.status).toBe("paused");
  });

  test("loadTimerState(): si el modo cacheado ya no existe, debe resetear al primer modo", async () => {
    mockGetTimerState.mockResolvedValueOnce({
      currentModeId: "999", // No existe
      time: 150,
      totalTime: 300,
      status: "paused",
      expectedEndTime: null
    });

    await getStore().getState().loadTimerState(mockModes);

    const state = getStore().getState();
    expect(state.currentModeId).toBe("1"); // Fallback
    expect(state.time).toBe(1500);
    expect(mockSaveTimerState).toHaveBeenCalled();
  });

  test("debe cambiar de modo correctamente y guardar", () => {
    const { setModes, switchMode } = getStore().getState();
    setModes(mockModes);
    switchMode("2");

    const state = getStore().getState();
    expect(state.currentModeId).toBe("2");
    expect(state.time).toBe(300);
    expect(state.totalTime).toBe(300);
    expect(mockSaveTimerState).toHaveBeenCalled();
  });

  test("start(): debe calcular el expectedEndTime y llamar al servicio nativo", () => {
    const mockNow = 1000000;
    const dateSpy = jest.spyOn(Date, "now").mockReturnValue(mockNow);

    const { setModes, start } = getStore().getState();
    setModes(mockModes);
    start();

    const state = getStore().getState();
    expect(state.status).toBe("running");
    expect(state.expectedEndTime).toBe(mockNow + 1500 * 1000);

    expect(mockAdapter.startService).toHaveBeenCalledWith(
      1500,
      "Pomodoro",
      "Studying",
      "Take a break",
      ""
    );
    expect(mockSaveTimerState).toHaveBeenCalled();
    dateSpy.mockRestore();
  });

  test("start(): no hace nada si mode es null", () => {
    getStore().setState({ currentModeId: "99" });
    getStore().getState().start();
    expect(mockAdapter.startService).not.toHaveBeenCalled();
  });

  test("tick(): no hace nada si no está corriendo o no hay expectedEndTime", () => {
    const { tick } = getStore().getState();
    tick(); // Está idle por default
    expect(getStore().getState().time).toBe(1500);
  });

  test("tick(): debe actualizar el tiempo basado en la diferencia de timestamps", () => {
    const startTime = 1000000;
    
    const dateSpy = jest.spyOn(Date, "now")
      .mockReturnValueOnce(startTime) // start
      .mockReturnValueOnce(startTime + 10000); // tick

    const { setModes, start, tick } = getStore().getState();
    setModes(mockModes);
    start();
    tick();

    const state = getStore().getState();
    expect(state.time).toBe(1490);
    expect(state.progress).toBeCloseTo(10 / 1500);

    dateSpy.mockRestore();
  });

  test("tick(): debe finalizar el temporizador y persistir", () => {
    const startTime = 1000000;
    const expectedEndTime = startTime + 1500 * 1000;
    
    const dateSpy = jest.spyOn(Date, "now")
      .mockReturnValueOnce(startTime) // start
      .mockReturnValueOnce(expectedEndTime + 1000); // tick

    const { setModes, start, tick } = getStore().getState();
    setModes(mockModes);
    start();
    tick();

    const state = getStore().getState();
    expect(state.time).toBe(0);
    expect(state.status).toBe("finished");
    expect(mockSaveTimerState).toHaveBeenCalled();

    dateSpy.mockRestore();
  });

  test("pause(): debe detener el servicio y limpiar el expectedEndTime", () => {
    const { setModes, start, pause } = getStore().getState();
    setModes(mockModes);
    start();
    pause();

    const state = getStore().getState();
    expect(state.status).toBe("paused");
    expect(state.expectedEndTime).toBeNull();
    expect(mockAdapter.stopService).toHaveBeenCalled();
    expect(mockSaveTimerState).toHaveBeenCalled();
  });

  test("reset(): debe volver al estado inicial del modo actual", () => {
    const { setModes, start, reset } = getStore().getState();
    setModes(mockModes);
    start();
    reset();

    const state = getStore().getState();
    expect(state.time).toBe(1500);
    expect(state.status).toBe("idle");
    expect(state.expectedEndTime).toBeNull();
    expect(mockSaveTimerState).toHaveBeenCalled();
  });

  describe("saveMode", () => {
    test("Añadir un modo nuevo", async () => {
      getStore().getState().setModes(mockModes);
      const newMode = { id: "3", label: "Nuevo", time: 600, icon: "star", color: "blue", messageActive: "A", messageFinished: "B" };
      
      await getStore().getState().saveMode(newMode);
      
      const state = getStore().getState();
      expect(state.modes).toHaveLength(3);
      expect(mockSaveModes).toHaveBeenCalledWith([...mockModes, newMode]);
    });

    test("Actualizar un modo que NO es el activo", async () => {
      getStore().getState().setModes(mockModes);
      const updatedMode = { ...mockModes[1], time: 700 };
      
      await getStore().getState().saveMode(updatedMode);
      
      const state = getStore().getState();
      expect(state.modes[1].time).toBe(700);
      expect(state.currentModeId).toBe("1");
      expect(state.time).toBe(1500); // El actual no se modificó
    });

    test("Actualizar el modo activo en estado idle replantea el contador inmediatamente", async () => {
      getStore().getState().setModes(mockModes);
      const updatedMode = { ...mockModes[0], time: 2000 };
      
      await getStore().getState().saveMode(updatedMode);
      
      // Estaba idle, el tiempo debe resetearse al nuevo time (2000)
      const state = getStore().getState();
      expect(state.time).toBe(2000);
      expect(state.totalTime).toBe(2000);
      expect(mockSaveTimerState).toHaveBeenCalled();
    });

    test("Actualizar el modo activo mientras corre o pausa", async () => {
      getStore().getState().setModes([...mockModes]);
      getStore().setState({ status: "running", expectedEndTime: Date.now() + 10000 });
      
      const updatedMode = { ...mockModes[0], time: 2000 };
      
      await getStore().getState().saveMode(updatedMode);
      
      // Como estaba corriendo, solo `totalTime` cambia, `time` sigue fluyendo independientemente
      const state = getStore().getState();
      expect(state.totalTime).toBe(2000);
      expect(state.time).toBe(1500);
      expect(mockSaveTimerState).toHaveBeenCalled();
    });
  });

  describe("deleteMode", () => {
    test("Borrar modo no actual no cambia el modo", async () => {
      getStore().getState().setModes(mockModes);
      
      await getStore().getState().deleteMode("2");
      expect(getStore().getState().modes).toHaveLength(1);
      expect(getStore().getState().currentModeId).toBe("1");
      expect(mockSaveModes).toHaveBeenCalled();
    });

    test("Borrar el modo actual selecciona el primero disponible", async () => {
      getStore().getState().setModes(mockModes);
      
      await getStore().getState().deleteMode("1");
      
      const state = getStore().getState();
      expect(state.modes).toHaveLength(1);
      expect(state.currentModeId).toBe("2");
    });
  });

});
