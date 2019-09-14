import { TokenContainerModule } from 'inversify-token';
import * as TYPES from 'src/types';
import { isTest } from 'src/util/env';
import { NativePermissionSource } from './sources/NativePermissionSource';
import { MockPermissionSource } from './sources/MockPermissionSource';


// @see https://github.com/mscharley/inversify-token#usage
export default new TokenContainerModule((bindToken) => {
  bindToken(TYPES.PermissionSource)
    .to(isTest ? MockPermissionSource : NativePermissionSource)
    .inSingletonScope();
});
