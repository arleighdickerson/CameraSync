import { Container } from 'inversify';
import {
  Token,
  getToken as _getToken,
  getAllToken as _getAllToken,
  getNamed as _getNamed,
  getTagged as _getTagged,
} from 'inversify-token';
import getDecorators from 'inversify-inject-decorators';
import emitterModule from 'src/modules/emitter/inversify.module';
import devicesModule from 'src/modules/devices/inversify.module';
import permissionsModule from 'src/modules/permissions/inversify.module';
import rootModule from 'src/modules/inversify.module';
import { createGhostObject } from 'src/util/ghostObject';

const createContainer = () => {
  const container = new Container();

  container.load(
    emitterModule,
    devicesModule,
    permissionsModule,
    rootModule
  );

  return container;
};

export const container: Container = createGhostObject(createContainer);

export const getToken = <T>(token: Token<T>) => _getToken(container, token);
export const getAllToken = <T>(token: Token<T>) => _getAllToken(container, token);
export const getNamed = <T>(token: Token<T>, named: string | number | symbol) => _getNamed(container, token, named);
export const getTagged = <T>(token: Token<T>, key: string | number | symbol, value: any) => _getTagged(container, token, key, value);

const decorators = getDecorators(container);

export const lazyInject = decorators.lazyInject;
export const lazyInjectNamed = decorators.lazyInjectNamed;
export const lazyInjectTagged = decorators.lazyInjectTagged;
export const lazyMultiInject = decorators.lazyMultiInject;

