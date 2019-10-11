import { Token, TokenType } from 'inversify-token';
import { Store } from 'redux';
import { EventEmitter as EventSource } from 'events';

import { DependencyOptions } from 'ioc/AppDependencies';

import { MtpSource } from 'modules/mtp/sources/MtpSource';

const DependencyOptionsToken = new Token<DependencyOptions>(Symbol.for('DependencyOptions'));
type DependencyOptionsToken = TokenType<typeof DependencyOptionsToken>
export { DependencyOptionsToken as DependencyOptions };

const StoreToken = new Token<Store>(Symbol.for('Store'));
type StoreToken = TokenType<typeof StoreToken>
export { StoreToken as Store };

const EventSourceToken = new Token<EventSource>(Symbol.for('EventSource'));
type EventSourceToken = TokenType<typeof EventSourceToken>
export { EventSourceToken as EventSource };

const MtpSourceToken = new Token<MtpSource>(Symbol.for('MtpSource'));
type MtpSourceToken = TokenType<typeof MtpSourceToken>
export { MtpSourceToken as MtpSource };
