export const isTest = process.env.NODE_ENV === 'test';
export const isJest = process.env.JEST_WORKER_ID !== undefined;
