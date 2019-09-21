import * as TYPES from 'types';
import { TokenContainerModule } from 'inversify-token';
import { NativeDeviceSource } from './sources/NativeDeviceSource';
import { MockDeviceSource } from './sources/MockDeviceSource';
import { EventHandlingDecorator } from './sources/EventHandlingDecorator';
import { isTest } from 'util/env';

// @see https://github.com/mscharley/inversify-token#usage

export default new TokenContainerModule((bindToken) => {
  const Class = EventHandlingDecorator.mixin(
    isTest
      ? MockDeviceSource
      : NativeDeviceSource
  );

  bindToken(TYPES.DeviceSource)
    .to(Class)
    .inSingletonScope();
});
/*
 .to(isTest ? MockDeviceSource : NativeDeviceSource)
  .inSingletonScope()
  .onActivation(({container}, deviceSource) => {
      const decorator = new EventHandlingDecorator(deviceSource);
      const emitter = getToken(container, TYPES.EventSource);
      Object.entries(eventHandlers).forEach(([name, handler]) => {
          eventEmitter.addListener(name, handler);
      });
      return decorator;
  });
 */
