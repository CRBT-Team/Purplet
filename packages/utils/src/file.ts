import type { BlobResolvable } from './blob';

export interface RawFile {
  name: string;
  data: BlobResolvable;
  key?: string;
}

export interface DataWithFiles<T> {
  data: T;
  files: RawFile[];
}
