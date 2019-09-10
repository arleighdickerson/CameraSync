import { Container } from 'inversify';
import { devicesContainerModule } from 'src/modules/devices/inversify.module';
import { createGhostObject } from '../util/ghostObject';

const createContainer = () => {
  const container = new Container();
  container.load(devicesContainerModule);
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
