import type { StyleProp, ViewStyle } from "react-native";

export type OnLoadEventPayload = {
  url: string;
};

export type ChangeEventPayload = {
  value: string;
};

export type CoreTimerViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};

export type CoreTimerModuleEvents = {
  // El evento que emitimos desde Kotlin
  onTimerFinished: (event: { finished: boolean }) => void;
};

// Aquí definimos las funciones que JavaScript puede llamar
export type CoreTimerModule = {
  startService: (
    targetTime: number,
    title: string,
    bodyActive: string,
    bodyFinished: string,
    soundUri: string,
  ) => Promise<void>;
  stopService: () => Promise<void>;
  getSystemSounds: () => Promise<{ name: string; uri: string }[]>;
};
