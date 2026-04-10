import { AsyncStorageSettingsRepository } from "../AsyncStorageSettingsRepository";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("AsyncStorageSettingsRepository", () => {
  let repository: AsyncStorageSettingsRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new AsyncStorageSettingsRepository();
  });

  // --- VIBRATION ---
  test("getVibrationEnabled() devuelve valor guardado", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("false");
    expect(await repository.getVibrationEnabled()).toBe(false);
  });

  test("getVibrationEnabled() devuelve true por defecto si no hay o falla", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    expect(await repository.getVibrationEnabled()).toBe(true);

    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error());
    expect(await repository.getVibrationEnabled()).toBe(true);
  });

  test("setVibrationEnabled() guarda correctamente", async () => {
    await repository.setVibrationEnabled(false);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@pomodoro_vibration", "false");
  });

  // --- SOUND ---
  test("getSelectedSound() devuelve sonido", async () => {
    const snd = { name: "A", uri: "B" };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(snd));
    expect(await repository.getSelectedSound()).toEqual(snd);
  });

  test("getSelectedSound() devuelve null si no hay o falla", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    expect(await repository.getSelectedSound()).toBeNull();

    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error());
    expect(await repository.getSelectedSound()).toBeNull();
  });

  test("setSelectedSound() guarda sonido", async () => {
    const snd = { name: "A", uri: "B" };
    await repository.setSelectedSound(snd);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@pomodoro_default_sound", JSON.stringify(snd));
  });

  // --- HAPTIC PULSE ---
  test("getHapticPulseEnabled() devuelve guardado o false", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("true");
    expect(await repository.getHapticPulseEnabled()).toBe(true);

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    expect(await repository.getHapticPulseEnabled()).toBe(false);

    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error());
    expect(await repository.getHapticPulseEnabled()).toBe(false);
  });

  test("setHapticPulseEnabled() guarda false", async () => {
    await repository.setHapticPulseEnabled(false);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@pomodoro_haptic_pulse", "false");
  });

  // --- HAPTIC DURATION ---
  test("getHapticPulseDuration() devuelve guardado o 10", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("5");
    expect(await repository.getHapticPulseDuration()).toBe(5);

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    expect(await repository.getHapticPulseDuration()).toBe(10);

    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error());
    expect(await repository.getHapticPulseDuration()).toBe(10);
  });

  test("setHapticPulseDuration() guarda duracion", async () => {
    await repository.setHapticPulseDuration(15);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@pomodoro_haptic_pulse_duration", "15");
  });

  // --- THEME ---
  test("getThemeMode() devuelve guardado o dark", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("light");
    expect(await repository.getThemeMode()).toBe("light");

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    expect(await repository.getThemeMode()).toBe("dark");

    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error());
    expect(await repository.getThemeMode()).toBe("dark");
  });

  test("setThemeMode() guarda theme sin json", async () => {
    await repository.setThemeMode("light");
    // Theme es string directa en el store, no json
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@pomodoro_theme_mode", "light");
  });
});
