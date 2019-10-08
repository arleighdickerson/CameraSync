import { TokenContainerModule } from 'inversify-token';
import * as TYPES from 'types';
import { isTest } from 'util/env';
import { NativeMtpSource } from './sources/NativeMtpSource';
import { MockMtpSource } from './sources/MockMtpSource';
import { interfaces } from 'inversify';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (container: interfaces.Container) => new TokenContainerModule((bindToken) => {

  // @see https://github.com/mscharley/inversify-token#usage
  bindToken(TYPES.MtpSource)
    .to(isTest ? MockMtpSource : NativeMtpSource)
    .inSingletonScope();
});
