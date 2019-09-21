import { Container } from 'inversify';
import * as modules from 'modules';
import { createGhostObject } from 'util/ghostObject';
import emitterModule from './inversify.module';
import appModule from 'components/App/inversify.module';

export const container: Container = createGhostObject(() => {
  const instance = new Container();

  instance.load(
    ...Object.values(modules).map(m => m.containerModule),
    emitterModule,
    appModule
  );

  return instance;
});
