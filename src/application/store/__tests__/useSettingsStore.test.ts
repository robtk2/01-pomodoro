const audioPreviewService = require("@infrastructure/services/AudioPreviewService").audioPreviewService;

// Mock del adaptador
const mockGetSystemSounds = jest.fn().mockResolvedValue([
  { name: "Beep", uri: "beep.mp3" },
  { name: "Alarm", uri: "alarm.mp3" },
]);

jest.mock("@infrastructure/adapters/NativeCoreTimerAdapter", () => ({
  NativeCoreTimerAdapter: jest.fn().mockImplementation(() => ({
    getSystemSounds: mockGetSystemSounds,
  })),
}));

// Mock del Repository
const mockGetVibrationEnabled = jest.fn().mockResolvedValue(true);
const mockGetHapticPulseEnabled = jest.fn().mockResolvedValue(false);
const mockGetHapticPulseDuration = jest.fn().mockResolvedValue(10);
const mockGetSelectedSound = jest.fn().mockResolvedValue(null);
const mockGetThemeMode = jest.fn().mockResolvedValue("dark");

const mockSetVibrationEnabled = jest.fn().mockResolvedValue(undefined);
const mockSetHapticPulseEnabled = jest.fn().mockResolvedValue(undefined);
const mockSetHapticPulseDuration = jest.fn().mockResolvedValue(undefined);
const mockSetSelectedSound = jest.fn().mockResolvedValue(undefined);
const mockSetThemeMode = jest.fn().mockResolvedValue(undefined);

jest.mock("@infrastructure/adapters/AsyncStorageSettingsRepository", () => ({
  AsyncStorageSettingsRepository: jest.fn().mockImplementation(() => ({
    getVibrationEnabled: mockGetVibrationEnabled,
    getHapticPulseEnabled: mockGetHapticPulseEnabled,
    getHapticPulseDuration: mockGetHapticPulseDuration,
    getSelectedSound: mockGetSelectedSound,
    getThemeMode: mockGetThemeMode,
    setVibrationEnabled: mockSetVibrationEnabled,
    setHapticPulseEnabled: mockSetHapticPulseEnabled,
    setHapticPulseDuration: mockSetHapticPulseDuration,
    setSelectedSound: mockSetSelectedSound,
    setThemeMode: mockSetThemeMode,
  })),
}));

// Mock del Servicio de Audio
jest.mock("@infrastructure/services/AudioPreviewService", () => ({
  audioPreviewService: {
    playSoundPreview: jest.fn().mockResolvedValue(undefined),
    stopSoundPreview: jest.fn().mockResolvedValue(undefined),
  }
}));

// Mocks diferidos para el store
const getStore = () => require("../useSettingsStore").useSettingsStore;

describe("useSettingsStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset del store a través de Zustand (acceso interno)
    getStore().setState({
      vibrationEnabled: true,
      hapticPulseEnabled: false,
      hapticPulseDuration: 10,
      defaultSound: null,
      availableSounds: [],
      themeMode: "light",
      isLoading: false,
    });
  });

  test("loadSettings(): debe cargar configuraciones desde el repositorio", async () => {
    await getStore().getState().loadSettings();

    const state = getStore().getState();
    expect(mockGetVibrationEnabled).toHaveBeenCalled();
    expect(mockGetHapticPulseEnabled).toHaveBeenCalled();
    expect(mockGetHapticPulseDuration).toHaveBeenCalled();
    expect(mockGetSelectedSound).toHaveBeenCalled();
    expect(mockGetThemeMode).toHaveBeenCalled();

    expect(state.vibrationEnabled).toBe(true);
    expect(state.hapticPulseEnabled).toBe(false);
    expect(state.hapticPulseDuration).toBe(10);
    expect(state.defaultSound).toBe(null);
    expect(state.themeMode).toBe("dark");
    expect(state.isLoading).toBe(false);
  });

  test("setVibrationEnabled(): debe actualizar el estado y persistir", async () => {
    await getStore().getState().setVibrationEnabled(false);
    expect(mockSetVibrationEnabled).toHaveBeenCalledWith(false);
    expect(getStore().getState().vibrationEnabled).toBe(false);
  });

  test("setHapticPulseEnabled(): debe actualizar el estado y persistir", async () => {
    await getStore().getState().setHapticPulseEnabled(true);
    expect(mockSetHapticPulseEnabled).toHaveBeenCalledWith(true);
    expect(getStore().getState().hapticPulseEnabled).toBe(true);
  });

  test("setHapticPulseDuration(): debe permitir cambiar y persistir la duración", async () => {
    await getStore().getState().setHapticPulseDuration(15);
    expect(mockSetHapticPulseDuration).toHaveBeenCalledWith(15);
    expect(getStore().getState().hapticPulseDuration).toBe(15);
  });

  test("setDefaultSound(): debe actualizar el estado y persistir", async () => {
    const sound = { name: "Test", uri: "test.mp3" };
    await getStore().getState().setDefaultSound(sound);
    expect(mockSetSelectedSound).toHaveBeenCalledWith(sound);
    expect(getStore().getState().defaultSound).toEqual(sound);
  });

  test("setThemeMode(): debe actualizar el estado y persistir", async () => {
    await getStore().getState().setThemeMode("dark");
    expect(mockSetThemeMode).toHaveBeenCalledWith("dark");
    expect(getStore().getState().themeMode).toBe("dark");
  });

  test("loadAvailableSounds(): debe cargar los sonidos desde el bridge nativo", async () => {
    await getStore().getState().loadAvailableSounds();

    const state = getStore().getState();
    expect(mockGetSystemSounds).toHaveBeenCalled();
    expect(state.availableSounds).toHaveLength(2);
    expect(state.availableSounds[0].name).toBe("Beep");
    expect(state.isLoading).toBe(false);
  });

  test("loadAvailableSounds(): no debe recargar si ya hay sonidos presentes", async () => {
    getStore().setState({ availableSounds: [{ name: "Test", uri: "test.mp3" }] });
    
    await getStore().getState().loadAvailableSounds();
    
    expect(mockGetSystemSounds).not.toHaveBeenCalled();
  });

  test("loadAvailableSounds(): debe manejar errores correctamente", async () => {
    mockGetSystemSounds.mockRejectedValueOnce(new Error("Failed to load sounds"));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await getStore().getState().loadAvailableSounds();
    
    const state = getStore().getState();
    expect(consoleSpy).toHaveBeenCalledWith("Error loading sounds:", expect.any(Error));
    expect(state.availableSounds).toHaveLength(0);
    expect(state.isLoading).toBe(false);
    
    consoleSpy.mockRestore();
  });

  test("playSoundPreview(): debe delegar a audioPreviewService", async () => {
    const uri = "test.mp3";
    await getStore().getState().playSoundPreview(uri);

    expect(audioPreviewService.playSoundPreview).toHaveBeenCalledWith(uri);
  });

  test("playSoundPreview(): debe capturar error si audioPreviewService arroja", async () => {
    (audioPreviewService.playSoundPreview as jest.Mock).mockRejectedValueOnce(new Error("Playback error"));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getStore().getState().playSoundPreview("test.mp3");

    expect(consoleSpy).toHaveBeenCalledWith("Error playing preview:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  test("stopSoundPreview(): debe delegar a audioPreviewService", async () => {
    await getStore().getState().stopSoundPreview();
    
    expect(audioPreviewService.stopSoundPreview).toHaveBeenCalled();
  });

});
