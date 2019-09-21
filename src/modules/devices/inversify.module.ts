import * as TYPES from 'src/types';
import { TokenContainerModule } from 'inversify-token';
import { NativeDeviceSource } from './sources/NativeDeviceSource';
import { MockDeviceSource } from './sources/MockDeviceSource';
import { isTest } from 'src/util/env';

// @see https://github.com/mscharley/inversify-token#usage


export default new TokenContainerModule((bindToken) => {
  bindToken(TYPES.DeviceSource)
    .to(isTest ? MockDeviceSource : NativeDeviceSource)
    .inSingletonScope();
});
