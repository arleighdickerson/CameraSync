import { Container } from 'inversify';
import * as modules from 'src/modules';
import { createGhostObject } from 'src/util/ghostObject';
import appDependencies from 'src/AppDependencies';

export const container: Container = createGhostObject(() => {
  const instance = new Container();
  instance.load(...Object.values(modules).map(m => m.containerModule), appDependencies);
  return instance;
});
