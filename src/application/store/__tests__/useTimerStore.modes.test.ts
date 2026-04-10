import { useTimerStore } from "../useTimerStore";
import { AsyncStorageModeRepository } from "@infrastructure/adapters/AsyncStorageModeRepository";

// Mock del repositorio
jest.mock("@infrastructure/adapters/AsyncStorageModeRepository");

describe("useTimerStore - Mode Management", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    new AsyncStorageModeRepository(); // Trigger constructor mock if needed
    
    // Resetear el store a su estado inicial para cada test
    useTimerStore.setState({
      modes: [
        { id: "1", label: "Mode 1", time: 60, color: "red", icon: "icon", messageActive: "", messageFinished: "" }
      ],
      currentModeId: "1"
    });
  });

  test("saveMode(): debe añadir un nuevo modo si no existe", async () => {
    const newMode = { id: "2", label: "New Mode", time: 100, color: "blue", icon: "icon", messageActive: "", messageFinished: "" };
    
    await useTimerStore.getState().saveMode(newMode);

    const state = useTimerStore.getState();
    expect(state.modes).toHaveLength(2);
    expect(state.modes.find(m => m.id === "2")).toBeDefined();
    
    // Verificamos persistencia a través del prototipo de la clase mockeada
    expect(AsyncStorageModeRepository.prototype.saveModes).toHaveBeenCalled();
  });


  test("saveMode(): debe actualizar un modo existente", async () => {
    const updatedMode = { id: "1", label: "Updated Title", time: 60, color: "red", icon: "icon", messageActive: "", messageFinished: "" };
    
    await useTimerStore.getState().saveMode(updatedMode);

    const state = useTimerStore.getState();
    expect(state.modes).toHaveLength(1);
    expect(state.modes[0].label).toBe("Updated Title");
  });

  test("deleteMode(): debe eliminar un modo y cambiar el modo actual si era el eliminado", async () => {
    const mode2 = { id: "2", label: "Mode 2", time: 120, color: "green", icon: "icon", messageActive: "", messageFinished: "" };
    useTimerStore.setState({ modes: [
      { id: "1", label: "Mode 1", time: 60, color: "red", icon: "icon", messageActive: "", messageFinished: "" },
      mode2
    ], currentModeId: "1" });

    await useTimerStore.getState().deleteMode("1");

    const state = useTimerStore.getState();
    expect(state.modes).toHaveLength(1);
    expect(state.modes[0].id).toBe("2");
    expect(state.currentModeId).toBe("2"); // Auto-switch
  });

  test("deleteMode(): no debe cambiar el currentModeId si se elimina otro modo", async () => {
    const mode2 = { id: "2", label: "Mode 2", time: 120, color: "green", icon: "icon", messageActive: "", messageFinished: "" };
    useTimerStore.setState({ modes: [
      { id: "1", label: "Mode 1", time: 60, color: "red", icon: "icon", messageActive: "", messageFinished: "" },
      mode2
    ], currentModeId: "1" });

    await useTimerStore.getState().deleteMode("2");

    const state = useTimerStore.getState();
    expect(state.currentModeId).toBe("1");
  });
});
