import { ReflectiveInjector, Injectable } from 'injection-js';

class Http {
}

@Injectable()
class Service {
  constructor(private http: Http) {
  }
}

export default () => {
  const injector = ReflectiveInjector.resolveAndCreate([Service, Http]);
  const s = injector.get(Service);
  const isInstance = s instanceof Service;

  return s;
};
