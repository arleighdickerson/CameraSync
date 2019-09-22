// https://stackoverflow.com/questions/51521808/how-do-i-create-a-type-from-a-string-array-in-typescript/
export type Constructor<T = {}> = new (...args: any[]) => T;

export type TYPES<T> = { readonly [P in keyof T]: string };

type valueCreator = (key: string) => string
export function strEnum<T extends string>(
  o: Array<T>,
  createValue: valueCreator = (key => key)
): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = createValue(key);
    return res;
  }, Object.create(null));
}


export function makeTypes<T>(typeEnum: T, prefix: string = ''): TYPES<T> {
  let typeList: string[] = [];
  const types = {} as TYPES<T>;
  if (typeEnum) {
    typeList = typeList.concat(Object.keys(typeEnum));
  }

  typeList.forEach(type => {
    // @ts-ignore
    types[type as string] = prefix + type;
  });

  return Object.freeze(types);
}

