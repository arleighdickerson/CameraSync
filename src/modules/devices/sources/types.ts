import { Token, TokenType } from 'inversify-token';
import { DeviceSource } from './DeviceSource';

const DeviceSourceToken = new Token<DeviceSource>(Symbol.for('DeviceSource'));
type DeviceSourceToken = TokenType<typeof DeviceSourceToken>

export { DeviceSourceToken as DeviceSource };
