import { Token, TokenType } from 'inversify-token';
import { EventEmitter as EventSource } from 'events';

const EventSourceToken = new Token<EventSource>(Symbol.for('EventSource'));
type EventSourceToken = TokenType<typeof EventSourceToken>

export { EventSourceToken as EventSource };
