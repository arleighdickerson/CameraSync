import { interfaces, Container } from 'inversify';
import * as modules from 'modules';
import { createGhostObject } from 'util/ghostObject';
import emitterModule from './inversify.module';
import { AppDependencies } from 'components/App/AppDependencies';

export default (dependencies: AppDependencies): interfaces.Container => createGhostObject(() => {
  const instance = new Container();

  instance.load(
    ...Object.values(modules).map(m => m.containerModule(instance)),
    emitterModule,
    dependencies
  );

  return instance;
});
