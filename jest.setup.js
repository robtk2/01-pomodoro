// Mock de AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => 
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock de Expo Modules (para evitar errores de ReferenceError en entorno Node)
jest.mock("expo-modules-core", () => ({
  NativeModulesProxy: {},
  requireNativeModule: jest.fn(() => ({})),
  requireNativeViewManager: jest.fn(() => ({})),
  ProxyNativeModule: {},
  EventEmitter: jest.fn().mockImplementation(() => ({
    addListener: jest.fn(),
    removeListeners: jest.fn(),
    removeAllListeners: jest.fn(),
    emit: jest.fn(),
  })),
}));

// Mock de Expo Blur
jest.mock("expo-blur", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    BlurView: (props) => React.createElement(View, props),
  };
});

// Mock de @expo/vector-icons
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Ionicons: (props) => React.createElement(Text, props, "Icon"),
  };
});

// Mock de expo-linear-gradient
jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    LinearGradient: (props) => React.createElement(View, props),
  };
});

global.structuredClone = global.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)));
global.setImmediate = global.setImmediate || ((fn) => setTimeout(fn, 0));



// Mock de modulos de Expo comunes
jest.mock("expo-haptics", () => ({
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
  selectionAsync: jest.fn(),
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
}));

jest.mock("expo-av", () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockImplementation(() => Promise.resolve({
        sound: {
          playAsync: jest.fn(),
          stopAsync: jest.fn(),
          unloadAsync: jest.fn(),
          setOnPlaybackStatusUpdate: jest.fn(),
        },
        status: { isLoaded: true },
      })),
    },
  },
}));

// Mock del modulo nativo CoreTimer personalizado
jest.mock("@modules/core-timer", () => ({
  startService: jest.fn(),
  stopService: jest.fn(),
  getSystemSounds: jest.fn(() => Promise.resolve([])),
}));

// Mock global del adaptador de infraestructura para evitar errores de instanciacion
jest.mock("@infrastructure/adapters/NativeCoreTimerAdapter", () => {
  return {
    NativeCoreTimerAdapter: jest.fn().mockImplementation(() => ({
      startService: jest.fn(),
      stopService: jest.fn(),
      getSystemSounds: jest.fn(() => Promise.resolve([])),
    })),
  };
});
