import events from 'events';

export const nativeEventSourceFactory = (): events.EventEmitter => {
  const { NativeEventEmitter, DeviceEventEmitter } = require('react-native');
  return new NativeEventEmitter(DeviceEventEmitter.sharedSubscriber);
};
