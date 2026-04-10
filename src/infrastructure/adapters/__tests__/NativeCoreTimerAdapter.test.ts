jest.unmock("../NativeCoreTimerAdapter");
jest.unmock("@infrastructure/adapters/NativeCoreTimerAdapter");

import { NativeCoreTimerAdapter } from "../NativeCoreTimerAdapter";
import CoreTimer from "@modules/core-timer";

describe("NativeCoreTimerAdapter", () => {
  let adapter: NativeCoreTimerAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    adapter = new NativeCoreTimerAdapter();
    
    // CoreTimer is mocked in jest.setup.js without `default`.
    // When required, CoreTimer actually receives the mock object directly.
    (CoreTimer.startService as jest.Mock).mockResolvedValue(undefined);
    (CoreTimer.stopService as jest.Mock).mockResolvedValue(undefined);
    (CoreTimer.getSystemSounds as jest.Mock).mockResolvedValue([]);
  });

  test("startService() delega al CoreTimer nativo con el target time calculado", async () => {
    const mockNow = 1000000;
    const dateSpy = jest.spyOn(Date, "now").mockReturnValue(mockNow);

    await adapter.startService(1500, "Title", "Active", "Finished", "uri://test");

    const expectedTargetTime = mockNow + 1500 * 1000;
    expect(CoreTimer.startService).toHaveBeenCalledWith(
      expectedTargetTime,
      "Title",
      "Active",
      "Finished",
      "uri://test"
    );

    dateSpy.mockRestore();
  });

  test("startService() atrapa errores de ejecucion", async () => {
    (CoreTimer.startService as jest.Mock).mockRejectedValueOnce(new Error("Native Error"));
    const spy = jest.spyOn(console, "error").mockImplementation();

    await adapter.startService(1500, "Title", "Active", "Finished");

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("stopService() delega al CoreTimer nativo", async () => {
    await adapter.stopService();
    expect(CoreTimer.stopService).toHaveBeenCalled();
  });

  test("stopService() atrapa errores de ejecucion", async () => {
    (CoreTimer.stopService as jest.Mock).mockRejectedValueOnce(new Error("Native Error"));
    const spy = jest.spyOn(console, "error").mockImplementation();

    await adapter.stopService();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("getSystemSounds() delega al CoreTimer nativo", async () => {
    const mockSounds = [{ name: "A", uri: "B" }];
    (CoreTimer.getSystemSounds as jest.Mock).mockResolvedValueOnce(mockSounds);

    const result = await adapter.getSystemSounds();
    expect(result).toEqual(mockSounds);
  });

  test("getSystemSounds() atrapa errores y devuelve array vacio", async () => {
    (CoreTimer.getSystemSounds as jest.Mock).mockRejectedValueOnce(new Error("Native Error"));
    const spy = jest.spyOn(console, "error").mockImplementation();

    const result = await adapter.getSystemSounds();

    expect(result).toEqual([]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
