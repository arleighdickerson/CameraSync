import events from 'events';
import { isTest } from 'src/util/env';
import * as TYPES from 'src/types';
import { TokenContainerModule } from 'inversify-token';

export const mockEventSourceFactory = (): events.EventEmitter => {
  return new events.EventEmitter();
};

export const nativeEventSourceFactory = (): events.EventEmitter => {
  const { NativeEventEmitter, DeviceEventEmitter } = require('react-native');
  return new NativeEventEmitter(DeviceEventEmitter.sharedSubscriber);
};

// @see https://github.com/mscharley/inversify-token#usage

export default new TokenContainerModule((bindToken) => {
  const factory = isTest ? mockEventSourceFactory : nativeEventSourceFactory;
  bindToken(TYPES.EventSource).toDynamicValue(factory).inSingletonScope();
});
