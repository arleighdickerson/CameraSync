import * as TYPES from 'src/types';
import { TokenContainerModule } from 'inversify-token';
import { NativeDeviceSource } from './sources/NativeDeviceSource';
import { DeviceDuck } from './duck';

// @see https://github.com/mscharley/inversify-token#usage

export default new TokenContainerModule((bindToken) => {
  bindToken(TYPES.DeviceSource)
    .to(NativeDeviceSource)
    .inSingletonScope();

  bindToken(TYPES.Duck)
    .to(DeviceDuck)
    .inSingletonScope()
    .whenTargetNamed('devices');
});
