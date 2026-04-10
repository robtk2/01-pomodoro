import { HapticService } from "../HapticService";
import * as Haptics from "expo-haptics";
import { Platform, Vibration } from "react-native";

jest.mock("expo-haptics", () => ({
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
  selectionAsync: jest.fn(),
  NotificationFeedbackType: { Success: 1, Error: 2 },
  ImpactFeedbackStyle: { Heavy: 1, Light: 2 },
}));

jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
  Vibration: { vibrate: jest.fn() },
}));

describe("HapticService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("success()", () => {
    test("llama a notificationAsync con Success", async () => {
      await HapticService.success();
      expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Success);
    });
  });

  describe("error()", () => {
    test("llama a notificationAsync con Error", async () => {
      await HapticService.error();
      expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Error);
    });
  });

  describe("impactMedium()", () => {
    test("Android: usa Vibration.vibrate(80)", async () => {
      Platform.OS = "android";
      await HapticService.impactMedium();
      expect(Vibration.vibrate).toHaveBeenCalledWith(80);
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    test("iOS: usa Haptics.impactAsync(Heavy)", async () => {
      Platform.OS = "ios";
      await HapticService.impactMedium();
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Heavy);
      expect(Vibration.vibrate).not.toHaveBeenCalled();
    });
  });

  describe("impactLight()", () => {
    test("Android: usa Vibration.vibrate(30)", async () => {
      Platform.OS = "android";
      await HapticService.impactLight();
      expect(Vibration.vibrate).toHaveBeenCalledWith(30);
      expect(Haptics.selectionAsync).not.toHaveBeenCalled();
    });

    test("iOS: usa Haptics.selectionAsync()", async () => {
      Platform.OS = "ios";
      await HapticService.impactLight();
      expect(Haptics.selectionAsync).toHaveBeenCalled();
      expect(Vibration.vibrate).not.toHaveBeenCalled();
    });
  });

  describe("selection()", () => {
    test("Android: usa Vibration.vibrate(40)", async () => {
      Platform.OS = "android";
      await HapticService.selection();
      expect(Vibration.vibrate).toHaveBeenCalledWith(40);
      expect(Haptics.selectionAsync).not.toHaveBeenCalled();
    });

    test("iOS: usa Haptics.selectionAsync()", async () => {
      Platform.OS = "ios";
      await HapticService.selection();
      expect(Haptics.selectionAsync).toHaveBeenCalled();
      expect(Vibration.vibrate).not.toHaveBeenCalled();
    });
  });
});
