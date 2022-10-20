import input from './';
import type { Runtime } from '../types';

export const runtime: Runtime = async config => {
  return {
    input,
  };
};
