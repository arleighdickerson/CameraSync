import has = Reflect.has;

const getOrElse = (target: any, key: string, defaultValue: any) => {
  return has(target, key) ? target[key] : defaultValue;
};

const resolveGlobalBoolean = (key: string) => !!getOrElse(global, key, false);

export const isTest = resolveGlobalBoolean('__TEST__');

export const isJest = process.env.JEST_WORKER_ID !== undefined;

export const isDev = resolveGlobalBoolean('__DEV__');
