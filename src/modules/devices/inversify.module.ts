import { TYPES } from './';
import { TokenContainerModule } from 'inversify-token';
import { interfaces } from 'inversify';
import * as env from 'src/util/env';
import { mockDeviceSourceFactory } from './sources/mockDeviceSourceFactory';
import { nativeDeviceSourceFactory } from './sources/nativeDeviceSourceFactory';

// @see https://github.com/mscharley/inversify-token#usage

export default new TokenContainerModule((bindToken) => {
  const boundToken = bindToken(TYPES.DeviceSource);

  if (env.isJest) {
    return boundToken // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .toDynamicValue((ctx: interfaces.Context) => mockDeviceSourceFactory())
      .inTransientScope();
  }

  return boundToken // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .toDynamicValue((ctx: interfaces.Context) => nativeDeviceSourceFactory())
    .inSingletonScope();
});
