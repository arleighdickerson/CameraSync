import { DelegatingHandler, VirtualHandler } from './proxyHandlers';

function GhostObject<T>(thunk: () => T) {
  // @ts-ignore
  Object.defineProperty(this, 'val', {
    get() {
      return thunk.call(undefined);
    },
  });
}

GhostObject.prototype = Object.create(VirtualHandler.prototype);

const traps = [
  'apply',
  'construct',
  'defineProperty',
  'deleteProperty',
  'enumerate',
  'get',
  'getOwnPropertyDescriptor',
  'getPrototypeOf',
  'has',
  'isExtensible',
  'ownKeys',
  'preventExtensions',
  'set',
  'setPrototypeOf',
];

traps.forEach((name) => {
  GhostObject.prototype[name] = function trap(target: any, ...args: any) {
    // @ts-ignore
    return Reflect[name](this.val, ...args);
  };
});


export const singletonize = <T>(factory: () => T) => {
  let initialized: boolean = false;
  let result: T;
  return (): T => {
    if (!initialized) {
      [initialized, result] = [true, factory()];
    }
    return result;
  };
};

export function createGhostObject<T>(factory: () => T, singleton: boolean = true): T {
  return DelegatingHandler.proxyFor.call(GhostObject, {},
    singleton
      ? singletonize(factory)
      : factory
  );
}
