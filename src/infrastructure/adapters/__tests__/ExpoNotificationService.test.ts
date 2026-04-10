import { ExpoNotificationService } from "../ExpoNotificationService";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  AndroidImportance: { MAX: 5 },
}));

describe("ExpoNotificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("constructor() llama a configure() e inicializa el Channel en Android", () => {
    Platform.OS = "android";
    new ExpoNotificationService();

    expect(Notifications.setNotificationHandler).toHaveBeenCalled();
    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      "pomodoro-alerts",
      expect.any(Object)
    );
  });

  test("constructor() llama a configure() pero NO inicializa el Channel en iOS", () => {
    Platform.OS = "ios";
    new ExpoNotificationService();

    expect(Notifications.setNotificationHandler).toHaveBeenCalled();
    expect(Notifications.setNotificationChannelAsync).not.toHaveBeenCalled();
  });

  test("sendImmediateNotification() ignora peticion si no hay permisos", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: "undetermined" });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: "denied" });

    const service = new ExpoNotificationService();
    await service.sendImmediateNotification("Title", "Body");

    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  test("sendImmediateNotification() pide permiso si es necesario y programa notificacion", async () => {
    // Escenario 1: Permiso estaba previamente garantizado
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: "granted" });

    const service = new ExpoNotificationService();
    await service.sendImmediateNotification("Title", "Body");

    expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: "Title",
        body: "Body",
        data: { data: "goes here" },
      },
      trigger: null,
    });
  });

  test("sendImmediateNotification() pide permiso dinamicamente si no lo tiene y programa si lo conceden", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: "undetermined" });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: "granted" });

    const service = new ExpoNotificationService();
    await service.sendImmediateNotification("Title", "Body");

    expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  test("handler function returns correct behavior", async () => {
    new ExpoNotificationService();
    
    // Extraemos la funcion anidada que se registro en el handler
    const handler = (Notifications.setNotificationHandler as jest.Mock).mock.calls[0][0].handleNotification;
    
    const result = await handler();
    
    expect(result).toEqual({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    });
  });
});
