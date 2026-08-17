export class ObjectUtils {
  public static getKeysAsString<T>(): KeysAsStrings<T> {
    return new Proxy(
      {},
      {
        get: (_, prop: string) => prop,
      },
    ) as KeysAsStrings<T>;
  }
}

export type KeysAsStrings<T> = { [K in keyof T]-?: K };
