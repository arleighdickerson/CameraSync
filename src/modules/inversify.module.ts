import { interfaces } from 'inversify';
import { TokenContainerModule, getToken } from 'inversify-token';

import * as TYPES from 'src/types';
import { RootDuck } from './RootDuck';

export default new TokenContainerModule(bindToken => {
  bindToken(TYPES.PermissionDuck).toDynamicValue((context: interfaces.Context) => {
    const rootDuck: RootDuck = getToken(context.container, TYPES.RootDuck);
    return rootDuck.ducks.permissions;
  });

  bindToken(TYPES.DeviceDuck).toDynamicValue((context: interfaces.Context) => {
    const rootDuck: RootDuck = getToken(context.container, TYPES.RootDuck);
    return rootDuck.ducks.devices;
  });
});
