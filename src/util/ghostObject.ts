import { DelegatingHandler, VirtualHandler } from './proxyHandlers';

function GhostObject<T>(thunk: () => T) {
  // @ts-ignore
  this.thunk = thunk;
  // @ts-ignore
  this.val = undefined;
}

GhostObject.prototype = Object.create(VirtualHandler.prototype);

GhostObject.prototype.init = function init() {
  if (this.thunk !== null) {
    this.val = this.thunk.call(undefined);
    this.thunk = null;
  }
};

const traps = [
  'getOwnPropertyDescriptor',
  'defineProperty',
  'getPrototypeOf',
  'enumerate',
  'ownKeys',
];

traps.forEach((name) => {
  GhostObject.prototype[name] = function trap(target: any, ...args: any) {
    this.init();
    // @ts-ignore
    return Reflect[name](this.val, ...args);
  };
});

export function createGhostObject<T>(factory: () => T): T {
  return DelegatingHandler.proxyFor.call(GhostObject, {}, factory);
}
