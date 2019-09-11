import * as TYPES from './sources/types';
import { TokenContainerModule } from 'inversify-token';
import { interfaces } from 'inversify';
import * as env from 'src/util/env';
import { mockPermissionSourceFactory } from './sources/mockPermissionSourceFactory';
import { nativePermissionSourceFactory } from './sources/nativePermissionSourceFactory';

// @see https://github.com/mscharley/inversify-token#usage

export default new TokenContainerModule((bindToken) => {
  const boundToken = bindToken(TYPES.PermissionSource);

  const registerMock = () => boundToken
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .toDynamicValue((ctx: interfaces.Context) => mockPermissionSourceFactory())
    .inTransientScope();

  const registerNative = () => boundToken
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .toDynamicValue((ctx: interfaces.Context) => nativePermissionSourceFactory())
    .inSingletonScope();

  if (env.isJest) {
    return registerMock();
  }

  if (env.isTest) {
    return registerMock();
  }

  return registerNative();
});
