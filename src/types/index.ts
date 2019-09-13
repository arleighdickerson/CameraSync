import { Token, TokenType } from 'inversify-token';
import { PermissionSource } from 'src/modules/permissions/sources/PermissionSource';
import { DeviceSource } from 'src/modules/devices/sources/DeviceSource';
import { Duck } from 'lib/duck';

const DuckToken = new Token<Duck>(Symbol.for('Duck'));
type DuckToken = TokenType<typeof DuckToken>
export { DuckToken as Duck };

const PermissionSourceToken = new Token<PermissionSource>(Symbol.for('PermissionSource'));
type PermissionSourceToken = TokenType<typeof PermissionSourceToken>
export { PermissionSourceToken as PermissionSource };

const DeviceSourceToken = new Token<DeviceSource>(Symbol.for('DeviceSource'));
type DeviceSourceToken = TokenType<typeof DeviceSourceToken>
export { DeviceSourceToken as DeviceSource };
