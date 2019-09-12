import { Container } from 'inversify';
import emitterModule from 'src/modules/emitter/inversify.module';
import devicesModule from 'src/modules/devices/inversify.module';
import permissionsModule from 'src/modules/permissions/inversify.module';
import { createGhostObject } from '../util/ghostObject';

const createContainer = () => {
  const container = new Container();

  container.load(emitterModule);
  container.load(devicesModule);
  container.load(permissionsModule);

  return container;
};

const createFactory = () => {
  let container: Container | null = null;
  return (): Container => {
    if (container === null) {
      container = createContainer();
    }
    return container;
  };
};

const factory = createFactory();

export const forceContainerInit = () => factory();

export const container: Container = createGhostObject(factory);

export default container;
