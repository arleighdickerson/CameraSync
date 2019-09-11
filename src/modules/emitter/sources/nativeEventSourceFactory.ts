import events from 'events';

const createSource = (): events.EventEmitter => {
  const { NativeEventEmitter, DeviceEventEmitter } = require('react-native');
  return new NativeEventEmitter(DeviceEventEmitter.sharedSubscriber);
};

function createSingletonFactory(): () => events.EventEmitter {
  let instance: events.EventEmitter | null = null;
  return () => {
    if (instance === null) {
      instance = createSource();
    }
    return instance;
  };
}

export const nativeEventSourceFactory = createSingletonFactory();
