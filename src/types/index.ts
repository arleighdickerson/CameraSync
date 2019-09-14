import { Token, TokenType } from 'inversify-token';
import { EventEmitter as EventSource } from 'events';
import { PermissionSource } from 'src/modules/permissions/sources/PermissionSource';
import { DeviceSource } from 'src/modules/devices/sources/DeviceSource';
import { Reducer, Store } from 'redux';
import { RootDuck } from 'src/modules/RootDuck';
import { PermissionDuck } from 'src/modules/permissions';
import { DeviceDuck } from 'src/modules/devices';
import { DuckRuntime } from 'lib/duck';

type Reducers = { [key: string]: Reducer }

const ReducersToken = new Token<Reducers>(Symbol.for('Reducers'));
type ReducersToken = TokenType<typeof ReducersToken>
export { ReducersToken as Reducers };

const RootDuckToken = new Token<RootDuck>(Symbol.for('RootDuck'));
type RootDuckToken = TokenType<typeof RootDuckToken>
export { RootDuckToken as RootDuck };

const PermissionDuckToken = new Token<PermissionDuck>(Symbol.for('PermissionDuck'));
type PermissionDuckToken = TokenType<typeof PermissionDuckToken>
export { PermissionDuckToken as PermissionDuck };

const DeviceDuckToken = new Token<DeviceDuck>(Symbol.for('DeviceDuck'));
type DeviceDuckToken = TokenType<typeof DeviceDuckToken>
export { DeviceDuckToken as DeviceDuck };

const PermissionSourceToken = new Token<PermissionSource>(Symbol.for('PermissionSource'));
type PermissionSourceToken = TokenType<typeof PermissionSourceToken>
export { PermissionSourceToken as PermissionSource };

const DeviceSourceToken = new Token<DeviceSource>(Symbol.for('DeviceSource'));
type DeviceSourceToken = TokenType<typeof DeviceSourceToken>
export { DeviceSourceToken as DeviceSource };

const EventSourceToken = new Token<EventSource>(Symbol.for('EventSource'));
type EventSourceToken = TokenType<typeof EventSourceToken>
export { EventSourceToken as EventSource };

const StoreToken = new Token<Store>(Symbol.for('Store'));
type StoreToken = TokenType<typeof StoreToken>
export { StoreToken as Store };

const DuckRuntimeToken = new Token<DuckRuntime>(Symbol.for('DuckRuntime'));
type DuckRuntimeToken = TokenType<typeof DuckRuntimeToken>
export { DuckRuntimeToken as DuckRuntime };
