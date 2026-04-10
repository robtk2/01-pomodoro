import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './CoreTimer.types';

type CoreTimerModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class CoreTimerModule extends NativeModule<CoreTimerModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(CoreTimerModule, 'CoreTimerModule');
