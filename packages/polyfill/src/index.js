// Blob is not global in node as of v18
if (typeof Blob === 'undefined') {
  const { Blob } = await import('node:buffer');
  globalThis.Blob = Blob;
}

// Fetch is not available in node <18
if (typeof fetch === 'undefined') {
  const undici = await import('undici');
  // Always apply everything here just in case undici and the implementation won't play nice
  globalThis.fetch = undici.fetch;
  globalThis.Request = undici.Request;
  globalThis.Response = undici.Response;
  globalThis.FormData = undici.FormData;
  globalThis.Headers = undici.Headers;
  globalThis.File = undici.File;
}
// FormData is not available in bun as of 0.1.2
else if (typeof FormData === 'undefined') {
  const formData = await import('form-data');
  globalThis.FormData = formData.default();
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
  const crypto = await import('node:crypto');
  globalThis.crypto = crypto.webcrypto;
}

// run dotenv on node specifically, since bun does this for us
if (typeof process !== 'undefined' && !process.isBun) {
  await import('dotenv/config');
}
