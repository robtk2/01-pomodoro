import { AsyncStorageModeRepository } from "../AsyncStorageModeRepository";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("AsyncStorageModeRepository", () => {
  let repository: AsyncStorageModeRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new AsyncStorageModeRepository();
  });

  test("getModes() devuelve defaultModes si getItem falla", async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error("Async Error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    const modes = await repository.getModes();
    
    expect(modes).toHaveLength(3); // Por defecto hay 3 modos
    expect(modes[0].id).toBe("pomodoro");
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test("getModes() devuelve parse del JSON si existe", async () => {
    const mockData = [{ id: "custom", label: "Custom", time: 100 }];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockData));
    
    const modes = await repository.getModes();
    
    expect(modes).toEqual(mockData);
  });

  test("getModes() hace resetToDefaults si no existe el JSON (getItem devuelve null)", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    
    const modes = await repository.getModes();
    
    expect(modes).toHaveLength(3);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@pomodoro_modes_v2", expect.any(String));
  });

  test("saveModes() serializa y guarda en AsyncStorage", async () => {
    const mockData = [{ id: "custom", label: "Custom", time: 100 } as any];
    await repository.saveModes(mockData);
    
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@pomodoro_modes_v2", JSON.stringify(mockData));
  });

  test("saveModes() atrapa la excepcion si setItem falla", async () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error("Disk full"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    await repository.saveModes([]);
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test("resetToDefaults() guarda the defaultModes y los devuelve", async () => {
    const modes = await repository.resetToDefaults();
    
    expect(modes).toHaveLength(3);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@pomodoro_modes_v2", JSON.stringify(modes));
  });
});
