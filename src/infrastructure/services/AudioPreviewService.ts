import { Audio } from "expo-av";

class AudioPreviewService {
  private previewSoundInstance: Audio.Sound | null = null;

  async playSoundPreview(uri: string): Promise<void> {
    try {
      if (this.previewSoundInstance) {
        await this.previewSoundInstance.stopAsync();
        await this.previewSoundInstance.unloadAsync();
        this.previewSoundInstance = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      this.previewSoundInstance = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          if (this.previewSoundInstance === sound) this.previewSoundInstance = null;
        }
      });
    } catch (error) {
      console.error("Error playing preview:", error);
      throw error; // Rethrow to let caller handle it if needed
    }
  }

  async stopSoundPreview(): Promise<void> {
    if (this.previewSoundInstance) {
      await this.previewSoundInstance.stopAsync();
      await this.previewSoundInstance.unloadAsync();
      this.previewSoundInstance = null;
    }
  }
}

export const audioPreviewService = new AudioPreviewService();
