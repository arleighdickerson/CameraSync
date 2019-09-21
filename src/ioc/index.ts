import { Container } from 'inversify';

import * as modules from 'src/modules';
import { createGhostObject } from 'src/util/ghostObject';

export const container: Container = createGhostObject(() => {
  const instance = new Container();
  instance.load(...Object.values(modules).map(m => m.containerModule));
  return instance;
});

export default container;
