// https://stackoverflow.com/questions/51521808/how-do-i-create-a-type-from-a-string-array-in-typescript/

export type Constructor<T = {}> = new (...args: any[]) => T;
export type ValueOf<T> = T[keyof T];

type Types<T, V> = { readonly [P in keyof T]: V };
type Factory<T, V> = (value: ValueOf<T>, key?: keyof T) => V

export function makeTypes<T, V>(typeEnum: T, factory?: Factory<T, V>): Types<T, V> {
  let typeList: string[] = [];
  const types = {} as Types<T, V>;
  if (typeEnum) {
    typeList = typeList.concat(Object.keys(typeEnum));
  }

  typeList.forEach(type => {
    // @ts-ignore
    types[type as string] = factory(typeEnum[type], type);
  });

  return Object.freeze(types);
}

export function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}
