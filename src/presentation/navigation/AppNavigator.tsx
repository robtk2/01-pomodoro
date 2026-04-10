import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "@presentation/screens/HomeScreen";
import { SettingsScreen } from "@presentation/screens/SettingsScreen";
import { ModesScreen } from "@presentation/screens/ModesScreen";
import { EditModeScreen } from "@presentation/screens/EditModeScreen";
import { SoundSelectorScreen } from "@presentation/screens/SoundSelectorScreen";

// Tipado para la navegación
export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Modes: undefined;
  EditMode: { mode?: any; selectedSoundUri?: string; selectedSoundName?: string };
  SoundSelector: { 
    modeId?: string; 
    currentSoundUri?: string;
    isSelection?: boolean;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navegador principal de la aplicación.
 * Utiliza animaciones fundidas para mantener la estética Obsidian Glass.
 */
export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: 'transparent' }, 
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen as any}
      />
      <Stack.Screen
        name="Modes"
        component={ModesScreen as any}
      />
      <Stack.Screen
        name="EditMode"
        component={EditModeScreen as any}
      />
      <Stack.Screen
        name="SoundSelector"
        component={SoundSelectorScreen as any}
      />

    </Stack.Navigator>
  );
};
