export interface PermissionSource {
    hasStorage: () => Promise<boolean>,
    hasDevice: (name?: string) => Promise<boolean>,
    authorizeStorage: () => Promise<boolean>,
    authorizeDevice: (name?: string) => Promise<boolean>,
}
