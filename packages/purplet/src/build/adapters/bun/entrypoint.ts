// Purplet adapter entrypoint for an express middleware/server

/// <reference path="../../../../adapter-imports.d.ts" />

import { handleInteraction, setGlobalEnv, setRestOptions } from '$$adapter';
import { errorNoPublicKey, errorNoToken } from 'purplet/internal';

setGlobalEnv({ env: process.env });

function hexStringToUint8Array(str: string) {
  const arr = new Uint8Array(str.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(str.slice(i * 2, i * 2 + 2), 16);
  }
  return arr;
}

const token = process.env.DISCORD_TOKEN!;
if (!token) {
  throw errorNoToken();
}
let publicKey = process.env.DISCORD_PUBLIC_KEY!;
if (!publicKey) {
  throw errorNoPublicKey();
}
const publicKeyUint8 = hexStringToUint8Array(publicKey);

setRestOptions({ token });

export default {
  fetch(request: Request) {
    return handleInteraction(request, publicKeyUint8);
  },
};
