import { container } from 'ioc';

class TestClass {
    private static _id: number = 0;

    constructor(readonly id = TestClass._id++) {
    }

    static get currentId() {
      return this._id;
    }
}

it('should handle factory-created singletons', () => {
  const identifier = Symbol.for('TestClass');
  container.bind(identifier)
    .toDynamicValue(() => new TestClass())
    .inSingletonScope();

  // is actually lazy
  expect(TestClass.currentId).toEqual(0);

  const t0 = container.get(identifier);
  expect(TestClass.currentId).toEqual(1);

  const t1 = container.get(identifier);

  // is actually singleton
  expect(t0).toEqual(t1);
});
