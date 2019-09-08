import { ReflectiveInjector, Injectable } from 'injection-js';

class Http {
}

@Injectable()
class Service {
  constructor(private http: Http) {
  }
}

it('should be able to create a Service instance', () => {
  const injector = ReflectiveInjector.resolveAndCreate([Service, Http]);
  expect(injector.get(Service)).toBeInstanceOf(Service);

});
