type Resolve<T> = (value?: T | PromiseLike<T>) => void
type Reject = (reason?: any) => void;

export default class Deferred<T> {
    private _resolve?: Resolve<T>;
    private _reject?: Reject;
    readonly promise: Promise<T>;

    constructor() {
      this.promise = new Promise((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
      });
    }

    get resolve(): Resolve<T> {
      // @ts-ignore
      return this._resolve;
    }

    get reject(): Reject {
      // @ts-ignore
      return this._reject;
    }
}
