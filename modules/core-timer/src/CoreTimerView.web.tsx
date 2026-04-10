import * as React from 'react';

import { CoreTimerViewProps } from './CoreTimer.types';

export default function CoreTimerView(props: CoreTimerViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
