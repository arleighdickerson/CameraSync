import { Container } from 'inversify';
import * as modules from 'src/modules';
import { createGhostObject } from 'src/util/ghostObject';
import emitter from './emitter.inversify';
import appDependencies from 'src/AppDependencies';

export const container: Container = createGhostObject(() => {
  const instance = new Container();
  instance.load(...Object.values(modules).map(m => m.containerModule), emitter, appDependencies);
  return instance;
});
