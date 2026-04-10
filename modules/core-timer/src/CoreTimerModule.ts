import { NativeModule, requireNativeModule } from 'expo';

import { CoreTimerModuleEvents } from './CoreTimer.types';

declare class CoreTimerModule extends NativeModule<CoreTimerModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<CoreTimerModule>('CoreTimer');
