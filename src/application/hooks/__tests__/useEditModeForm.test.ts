import { renderHook, act } from "@testing-library/react-native";
import { useEditModeForm } from "../useEditModeForm";
import { useTimerStore } from "@application/store/useTimerStore";
import { HapticService } from "@infrastructure/services/HapticService";
import { Alert } from "react-native";

jest.mock("@application/store/useTimerStore");
jest.mock("@infrastructure/services/HapticService");
jest.mock("react-native", () => ({
  Alert: { alert: jest.fn() },
}));

describe("useEditModeForm", () => {
  const mockSaveMode = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTimerStore as unknown as jest.Mock).mockReturnValue({
      saveMode: mockSaveMode,
    });
  });

  test("debe inicializar con valores por defecto si no se pasa initialMode", () => {
    const { result } = renderHook(() => useEditModeForm());
    
    expect(result.current.form.label).toBe("");
    expect(result.current.form.time).toBe(1500); // 25 * 60
    expect(result.current.minutes).toBe("25");
    expect(result.current.seconds).toBe("0");
  });

  test("debe inicializar con los valores de initialMode", () => {
    const initialMode = {
      id: "1", label: "Break", time: 300, color: "blue", icon: "coffee", messageActive: "A", messageFinished: "B"
    };
    const { result } = renderHook(() => useEditModeForm(initialMode));
    
    expect(result.current.form.label).toBe("Break");
    expect(result.current.minutes).toBe("5"); // 300 / 60
    expect(result.current.seconds).toBe("0");
  });

  test("updateField(): actualiza el estado y dispara selección háptica en color o icon", () => {
    const { result } = renderHook(() => useEditModeForm());
    
    act(() => {
      result.current.updateField("label", "New Name");
    });
    expect(result.current.form.label).toBe("New Name");
    expect(HapticService.selection).not.toHaveBeenCalled();

    act(() => {
      result.current.updateField("color", "red");
    });
    expect(result.current.form.color).toBe("red");
    expect(HapticService.selection).toHaveBeenCalledTimes(1);
    
    act(() => {
      result.current.updateField("icon", "star");
    });
    expect(result.current.form.icon).toBe("star");
    expect(HapticService.selection).toHaveBeenCalledTimes(2);
  });

  test("handleSave(): falla con error si el label está vacío", async () => {
    const { result } = renderHook(() => useEditModeForm()); // label vacío por default
    
    await act(async () => {
      await result.current.handleSave();
    });

    expect(HapticService.error).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith("Error", "El nombre del modo es obligatorio");
    expect(mockSaveMode).not.toHaveBeenCalled();
  });

  test("handleSave(): falla con error si el tiempo es <= 0", async () => {
    const { result } = renderHook(() => useEditModeForm());
    
    act(() => {
      result.current.updateField("label", "Test");
      result.current.setMinutes("0");
      result.current.setSeconds("0");
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(HapticService.error).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith("Error", "El tiempo debe ser mayor que cero");
    expect(mockSaveMode).not.toHaveBeenCalled();
  });

  test("handleSave(): guarda correctamente e invoca callback de éxito", async () => {
    mockSaveMode.mockResolvedValueOnce(undefined);
    const onSaveSuccess = jest.fn();

    const { result } = renderHook(() => useEditModeForm(undefined, onSaveSuccess));
    
    act(() => {
      result.current.updateField("label", "Valid Name");
      result.current.setMinutes("10"); // 600 secs
      result.current.setSeconds("30"); // 30 secs => 630
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockSaveMode).toHaveBeenCalledWith(expect.objectContaining({
      label: "Valid Name",
      time: 630
    }));
    expect(HapticService.success).toHaveBeenCalled();
    expect(onSaveSuccess).toHaveBeenCalled();
  });

  test("handleSave(): muestra error de alerta si throw en persistencia", async () => {
    mockSaveMode.mockRejectedValueOnce(new Error("Disk Full"));
    const { result } = renderHook(() => useEditModeForm());
    
    act(() => {
      result.current.updateField("label", "Valid Name");
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(HapticService.error).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith("Error", "No se pudo guardar el modo");
  });
});
