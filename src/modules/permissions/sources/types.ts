import { Token, TokenType } from 'inversify-token';
import { PermissionSource } from './PermissionSource';

const PermissionSourceToken = new Token<PermissionSource>(Symbol.for('PermissionSource'));
type PermissionSourceToken = TokenType<typeof PermissionSourceToken>

export { PermissionSourceToken as PermissionSource };
