// import * as env from 'src/util/env';
import * as TYPES from 'src/types';
// import MockPermissionSource from './sources/MockPermissionSource';
import { NativePermissionSource } from './sources/NativePermissionSource';
import { TokenContainerModule } from 'inversify-token';
import { PermissionDuck } from './duck';


// @see https://github.com/mscharley/inversify-token#usage
export default new TokenContainerModule((bindToken) => {
  bindToken(TYPES.PermissionSource)
    .to(NativePermissionSource)
    .inSingletonScope();

  /*
    bindToken(TYPES.Duck)
      .to(PermissionDuck)
      .inSingletonScope()
      .whenTargetNamed('permissions');
     */
});
