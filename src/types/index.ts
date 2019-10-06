import { Token, TokenType } from 'inversify-token';
import { EventEmitter as EventSource } from 'events';
import { PermissionSource } from 'modules/permissions/sources/PermissionSource';
import { DeviceSource } from 'modules/devices/sources/DeviceSource';
import { Store } from 'redux';
import { AppDependencies, DependencyOptions } from 'components/App';

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

const AppDependenciesToken = new Token<AppDependencies>(Symbol.for('AppDependencies'));
type AppDependenciesToken = TokenType<typeof AppDependenciesToken>
export { AppDependenciesToken as AppDependencies };

const DependencyOptionsToken = new Token<DependencyOptions>(Symbol.for('DependencyOptions'));
type DependencyOptionsToken = TokenType<typeof DependencyOptionsToken>
export { DependencyOptionsToken as DependencyOptions };
