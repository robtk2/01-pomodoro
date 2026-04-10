import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { 
  useFonts,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold 
} from "@expo-google-fonts/outfit";

import { useTimerStore } from "@application/store/useTimerStore";
import { useSettingsStore } from "@application/store/useSettingsStore";
import { useTimerEngine } from "@application/hooks/useTimerEngine";
import { AsyncStorageModeRepository } from "@infrastructure/adapters/AsyncStorageModeRepository";
import { ExpoNotificationService } from "@infrastructure/adapters/ExpoNotificationService";
import { AppNavigator } from "@presentation/navigation/AppNavigator";
import { AppBackground } from "@presentation/components/layout/AppBackground";
import Theme from "@theme";


// Inicializamos servicios de infraestructura
const modeRepository = new AsyncStorageModeRepository();
new ExpoNotificationService();

export default function App() {
  useTimerEngine();
  const loadTimerState = useTimerStore((state) => state.loadTimerState);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const themeMode = useSettingsStore((state) => state.themeMode);
  
  // Obtenemos el modo para teñir el fondo global
  const { modes, currentModeId } = useTimerStore();
  const currentMode = modes.find(m => m.id === currentModeId);

  const [fontsLoaded] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  useEffect(() => {
    // Bootstrap: Cargamos los modos, el reloj persistente y ajustes al arrancar
    const initApp = async () => {
      await Promise.all([
        modeRepository.getModes().then(modes => loadTimerState(modes)),
        loadSettings()
      ]);
    };

    initApp();
  }, [loadTimerState, loadSettings]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Theme?.colors?.background || "#080809", justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Theme?.colors?.primary || "#00F5FF"} />
      </View>
    );
  }


  return (
    <SafeAreaProvider>
      <AppBackground modeColor={currentMode?.color}>
        <NavigationContainer /* theme={navTheme} */>
          <AppNavigator />
        </NavigationContainer>
      </AppBackground>

      <StatusBar 
        style={themeMode === 'light' ? 'dark' : 'light'} 
        translucent={true} 
        backgroundColor="transparent" 
      />
    </SafeAreaProvider>
  );
}






