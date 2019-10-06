import { interfaces, Container } from 'inversify';
import * as ducks from 'modules';
import emitterModule from './emitter.module';

export const createContainer = (...modules: interfaces.ContainerModule[]) => {
  const container = new Container();

  container.load(
    emitterModule,
    ...Object.values(ducks).map(m => m.containerModule(container)),
    ...modules
  );

  return container;
};
