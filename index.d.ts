// TypeScript Version: 3.5.2

interface Options {
  live: boolean,
  waitTimeout: number,
  history: boolean,
  limit: number,
}

export declare function createWriter<T>(redis: T, key: string): NodeJS.WritableStream;
export declare function createReader<T>(redis: T, key: string, opt?: Options | T): NodeJS.ReadableStream;
