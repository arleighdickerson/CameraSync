import emitterModule from './emitter/inversify.module';
import deviceModule from './devices/inversify.module';
import permissionModule from './permissions/inversify.module';
import { TokenContainerModule } from 'inversify-token';

export const containerModules: { [key: string]: TokenContainerModule } = Object.freeze({
  emitter:     emitterModule,
  devices:     deviceModule,
  permissions: permissionModule,
});
