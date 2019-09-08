import { ReflectiveInjector, Injectable, Injector } from 'injection-js';

export class Http {
}

@Injectable()
export class Service {
  constructor(private http: Http) {
  }
}

@Injectable()
export class Service2 {
  constructor(private injector: Injector) {
  }

  getService(): void {
    console.log(this.injector.get(Service) instanceof Service);
  }

  createChildInjector(): void {
    const childInjector = ReflectiveInjector.resolveAndCreate([Service], this.injector);
  }
}

it('should be able to create a Service instance', () => {
  const injector = ReflectiveInjector.resolveAndCreate([Service, Http]);
  // injector.get(Service) instanceof Service
  expect(injector.get(Service)).toBeInstanceOf(Service);

});

