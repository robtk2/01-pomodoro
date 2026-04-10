import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ModeSelectorSheet } from "../ModeSelectorSheet";
import { TimerMode } from "@domain/modes/types";

// Datos de prueba
const mockModes: TimerMode[] = [
  { 
    id: "focus", 
    label: "Enfoque Profundo", 
    time: 1500, 
    color: "#FF0000", 
    icon: "timer", 
    messageActive: "Concentrado", 
    messageFinished: "Terminado", 
    soundUri: "" 
  },
  { 
    id: "break", 
    label: "Descanso Corto", 
    time: 300, 
    color: "#00FF00", 
    icon: "cafe", 
    messageActive: "Relax", 
    messageFinished: "Volver", 
    soundUri: "" 
  },
];

describe("ModeSelectorSheet", () => {
  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
    modes: mockModes,
    currentModeId: "focus",
    onSelectMode: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza la lista de modos correctamente", () => {
    const { getByText } = render(<ModeSelectorSheet {...defaultProps} />);

    expect(getByText("Enfoque Profundo")).toBeTruthy();
    expect(getByText("Descanso Corto")).toBeTruthy();
    // Verifica que el tiempo se formatea (25:00 para 1500s)
    expect(getByText("25:00")).toBeTruthy();
    expect(getByText("05:00")).toBeTruthy();
  });

  test("filtra los modos por búsqueda", () => {
    const { getByText, queryByText, getByPlaceholderText } = render(
      <ModeSelectorSheet {...defaultProps} />
    );

    const searchInput = getByPlaceholderText("Buscar modo...");
    
    // Filtramos por "Descanso"
    fireEvent.changeText(searchInput, "Descanso");

    expect(getByText("Descanso Corto")).toBeTruthy();
    expect(queryByText("Enfoque Profundo")).toBeNull();
  });

  test("llama a onSelectMode y onClose al seleccionar un modo", () => {
    const { getByText } = render(<ModeSelectorSheet {...defaultProps} />);

    const modeButton = getByText("Descanso Corto");
    fireEvent.press(modeButton);

    expect(defaultProps.onSelectMode).toHaveBeenCalledWith("break");
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test("muestra mensaje de lista vacía si no hay coincidencias", () => {
    const { getByText, getByPlaceholderText } = render(
      <ModeSelectorSheet {...defaultProps} />
    );

    const searchInput = getByPlaceholderText("Buscar modo...");
    fireEvent.changeText(searchInput, "ModoInexistente");

    expect(getByText("No se encontraron modos")).toBeTruthy();
  });

  test("no renderiza nada si isVisible es false (comportamiento de Modal)", () => {
     // Nota: En Jest con el mock por defecto de RN, Modal no renderiza contenido si visible={false}
     const { queryByText } = render(<ModeSelectorSheet {...defaultProps} isVisible={false} />);
     expect(queryByText("Seleccionar Modo")).toBeNull();
  });
});
