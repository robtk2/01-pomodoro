// Reexport the native module. On web, it will be resolved to CoreTimerModule.web.ts
// and on native platforms to CoreTimerModule.ts
export { default } from './src/CoreTimerModule';
export { default as CoreTimerView } from './src/CoreTimerView';
export * from  './src/CoreTimer.types';
