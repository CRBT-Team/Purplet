// Blob is not global in node as of v18
if (typeof Blob === 'undefined') {
  const { Blob } = await import('node:buffer');
  globalThis.Blob = Blob;
}

// Fetch is not available in node <18
if (typeof fetch === 'undefined') {
  const undici = await import('undici');
  globalThis.fetch = undici.fetch;

  // Always apply these just in case undici wouldn't play nice,
  // though i don't know if that's actually needed
  globalThis.Request = undici.Request;
  globalThis.Response = undici.Response;
  globalThis.FormData = undici.FormData;
  globalThis.Headers = undici.Headers;
  globalThis.File = undici.File;
}

// Websocket is not available in any node version as of v18
if (typeof WebSocket === 'undefined') {
  const ws = await import('ws');
  globalThis.WebSocket = ws.default;
}

// structuredClone is not available in node <17 and bun as of 0.1.2
if (typeof structuredClone === 'undefined') {
  const structuredClone = await import('@ungap/structured-clone');
  globalThis.structuredClone = structuredClone.default;
}

// crypto is not a global variable as of node 18
if (typeof crypto === 'undefined') {
  const crypto = await import('crypto');
  globalThis.crypto = crypto.webcrypto;
}

// run dotenv on node specifically, since bun does this for us
if (typeof process !== 'undefined' && !process.isBun) {
  await import('dotenv/config');
}
