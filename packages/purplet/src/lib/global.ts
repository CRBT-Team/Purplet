import type { REST } from '@discordjs/rest';

/** Global REST client from `@discordjs/rest`. */
export let rest: REST;

export function setRESTClient(newRest: REST) {
  rest = newRest;
}
