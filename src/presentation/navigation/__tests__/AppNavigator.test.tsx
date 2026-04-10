import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "../AppNavigator";

// Simulamos las pantallas para que no interfieran ni disparen hooks o lógica compleja
// Para evitar errores de React out-of-scope, simplemente devolvemos un componente que renderiza null
jest.mock("@presentation/screens/HomeScreen", () => ({ 
  HomeScreen: function MockHomeScreen() { return null; } 
}));
jest.mock("@presentation/screens/SettingsScreen", () => ({ 
  SettingsScreen: function MockSettingsScreen() { return null; } 
}));
jest.mock("@presentation/screens/ModesScreen", () => ({ 
  ModesScreen: function MockModesScreen() { return null; } 
}));
jest.mock("@presentation/screens/EditModeScreen", () => ({ 
  EditModeScreen: function MockEditModeScreen() { return null; } 
}));
jest.mock("@presentation/screens/SoundSelectorScreen", () => ({ 
  SoundSelectorScreen: function MockSoundSelectorScreen() { return null; } 
}));

describe("AppNavigator", () => {
  test("renderiza el navegador correctamente sin errores", () => {
    const { toJSON } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    expect(toJSON()).toBeTruthy();
  });
});
