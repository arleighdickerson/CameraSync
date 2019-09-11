import events from 'events';

const createSource = (): events.EventEmitter => {
  return new events.EventEmitter();
};

function createSingletonFactory(): () => events.EventEmitter {
  let instance: events.EventEmitter | null = null;
  return () => {
    if (instance === null) {
      instance = createSource();
    }
    return instance;
  };
}

export const emitterEventSourceFactory = createSingletonFactory();
