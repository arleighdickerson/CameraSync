import 'reflect-metadata';
// import 'core-js/es7/reflect';
// import 'core-js'
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
  // injector.get(Service) instanceof Service
  expect(injector.get(Service)).toBeInstanceOf(Service);

});

