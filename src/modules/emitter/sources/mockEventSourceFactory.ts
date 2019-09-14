import events from 'events';

export const mockEventSourceFactory = (): events.EventEmitter => {
  return new events.EventEmitter();
};
