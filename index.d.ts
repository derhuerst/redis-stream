// TypeScript Version: 3.5.2

export declare function createWriter<T>(redis: T, key: string): T;
export declare function createReader<T>(redis: T, key: string, opt?: T): T;
