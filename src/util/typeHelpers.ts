// https://stackoverflow.com/questions/51521808/how-do-i-create-a-type-from-a-string-array-in-typescript/
export type Constructor<T = {}> = new (...args: any[]) => T;

export function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}
