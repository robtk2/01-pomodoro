import { requireNativeView } from 'expo';
import * as React from 'react';

import { CoreTimerViewProps } from './CoreTimer.types';

const NativeView: React.ComponentType<CoreTimerViewProps> =
  requireNativeView('CoreTimer');

export default function CoreTimerView(props: CoreTimerViewProps) {
  return <NativeView {...props} />;
}
