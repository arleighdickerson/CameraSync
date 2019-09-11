import * as TYPES from './sources/types';
import { TokenContainerModule } from 'inversify-token';
import { interfaces } from 'inversify';
import * as env from 'src/util/env';
import { nativeEventSourceFactory } from './sources/nativeEventSourceFactory';
import { emitterEventSourceFactory } from './sources/emitterEventSourceFactory';

// @see https://github.com/mscharley/inversify-token#usage

export default new TokenContainerModule((bindToken) => {
  const boundToken = bindToken(TYPES.EventSource);

  if (env.isJest) {
    return boundToken // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .toDynamicValue((ctx: interfaces.Context) => emitterEventSourceFactory())
      .inTransientScope();
  }

  return boundToken // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .toDynamicValue((ctx: interfaces.Context) => nativeEventSourceFactory())
    .inSingletonScope();
});
