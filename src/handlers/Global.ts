import { Handler } from '..';

export interface GlobalData<T> {
  key: string;
  value: T;
  multi: boolean;
}

export class GlobalValuesHandler extends Handler<GlobalData<unknown>> {}
