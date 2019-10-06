import { compose as _compose } from 'redux';

export type DevToolOptions = {
    name?: string,
    filters?: {
        blacklist?: any,
        whitelist?: any
    },
    port?: number,
    hostname?: string,
    secure?: boolean,
    stateSanitizer?: any,
    actionSanitizer?: any,
    realtime?: boolean,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createWithoutDevTools = (opts: any) => _compose;

const createWithDevTools = __DEV__
  ? require('remote-redux-devtools').composeWithDevTools
  : createWithoutDevTools;

const createComposer = (devTools: boolean, devToolOptions: DevToolOptions) => {
  const createCompose = devTools ? createWithDevTools : createWithoutDevTools;
  return createCompose(devToolOptions);
};

export default createComposer;

export const compose = createComposer(true, {
  port:     8000,
  realtime: true,
});
