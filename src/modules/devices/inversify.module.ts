import * as TYPES from 'src/types';
import { TokenContainerModule } from 'inversify-token';
import { factory as nativeDeviceSourceFactory } from './sources/NativeDeviceSource';
import { MockDeviceSource } from './sources/MockDeviceSource';
import { isTest } from 'src/util/env';

// @see https://github.com/mscharley/inversify-token#usage


export default new TokenContainerModule((bindToken) => {
  if (isTest) {
    bindToken(TYPES.DeviceSource)
      .to(MockDeviceSource)
      .inSingletonScope();
  } else {
    bindToken(TYPES.DeviceSource)
      .toDynamicValue(nativeDeviceSourceFactory)
      .inSingletonScope();
  }
});
