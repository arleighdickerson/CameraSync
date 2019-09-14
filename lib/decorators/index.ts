import { tagged } from 'inversify';

export const native = (isNative: boolean) => tagged('native', isNative);

export const profile = (name: string) => tagged('profile', name);
