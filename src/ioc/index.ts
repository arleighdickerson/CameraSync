import { Container } from 'inversify';

import { containerModules } from 'src/modules';
import { createGhostObject } from 'src/util/ghostObject';

export const container: Container = createGhostObject(() => {
  const instance = new Container();
  instance.load(...Object.values(containerModules));
  return instance;
});

export default container;
