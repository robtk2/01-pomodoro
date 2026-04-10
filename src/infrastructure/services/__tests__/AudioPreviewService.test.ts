import { audioPreviewService } from "../AudioPreviewService";
import { Audio } from "expo-av";

const mockUnloadAsync = jest.fn();
const mockStopAsync = jest.fn();
const mockSetOnPlaybackStatusUpdate = jest.fn();

jest.mock("expo-av", () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(),
    },
  },
}));

describe("AudioPreviewService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar comportamiento por defecto del mock de createAsync
    (Audio.Sound.createAsync as jest.Mock).mockResolvedValue({
      sound: {
        stopAsync: mockStopAsync,
        unloadAsync: mockUnloadAsync,
        setOnPlaybackStatusUpdate: mockSetOnPlaybackStatusUpdate,
      },
    });

    // Limpiamos el estado interno forzando un stop en caso de que quede algo colgado
    audioPreviewService.stopSoundPreview();
  });

  test("playSoundPreview() crea y reproduce un nuevo sonido", async () => {
    await audioPreviewService.playSoundPreview("test.mp3");

    expect(Audio.Sound.createAsync).toHaveBeenCalledWith(
      { uri: "test.mp3" },
      { shouldPlay: true }
    );
    expect(mockSetOnPlaybackStatusUpdate).toHaveBeenCalled();
  });

  test("playSoundPreview() detiene y descarga la instancia anterior antes de crear otra", async () => {
    await audioPreviewService.playSoundPreview("test1.mp3");
    
    // Comprobamos que el primero se creó
    expect(Audio.Sound.createAsync).toHaveBeenCalledTimes(1);

    await audioPreviewService.playSoundPreview("test2.mp3");

    // Comprobamos que, al intentar reproducir otro, frena el viejo
    expect(mockStopAsync).toHaveBeenCalled();
    expect(mockUnloadAsync).toHaveBeenCalled();
    
    expect(Audio.Sound.createAsync).toHaveBeenCalledTimes(2);
  });

  test("playSoundPreview() atrapa y relanza errores de creacion", async () => {
    const error = new Error("Audio Error");
    (Audio.Sound.createAsync as jest.Mock).mockRejectedValueOnce(error);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(audioPreviewService.playSoundPreview("test.mp3")).rejects.toThrow("Audio Error");
    
    expect(consoleSpy).toHaveBeenCalledWith("Error playing preview:", error);
    consoleSpy.mockRestore();
  });

  test("stopSoundPreview() detiene la instancia si existe", async () => {
    await audioPreviewService.playSoundPreview("test.mp3");
    await audioPreviewService.stopSoundPreview();

    expect(mockStopAsync).toHaveBeenCalled();
    expect(mockUnloadAsync).toHaveBeenCalled();
  });

  test("El evento de fin de reproduccion (didJustFinish) descarga el sonido automáticamente", async () => {
    await audioPreviewService.playSoundPreview("test.mp3");

    // Extraemos la funcion de actualización del mock
    const callback = mockSetOnPlaybackStatusUpdate.mock.calls[0][0];

    // Llamamos simulando que NO termino (no unload)
    callback({ isLoaded: true, didJustFinish: false });
    expect(mockUnloadAsync).not.toHaveBeenCalled();

    // Llamamos simulando que SI termino
    callback({ isLoaded: true, didJustFinish: true });
    
    // Verificamos que unload fue llamado a raiz de terminar la reproducción sola
    expect(mockUnloadAsync).toHaveBeenCalled();
  });

});
