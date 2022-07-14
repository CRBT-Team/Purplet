import type { Rest } from '@purplet/rest';

/** Global REST client from `@purplet/rest`. */
export let rest: Rest;

export function setRESTClient(newRest: Rest) {
  rest = newRest;
}
