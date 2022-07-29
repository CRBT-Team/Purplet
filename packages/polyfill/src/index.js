// @ts-nocheck This file messes with lots of globals and basically every line is a type error.

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
  const _Blob = globalThis.Blob;
  const formData = await import('formdata-node/lib/esm');
  const { FormDataEncoder } = await import('form-data-encoder');
  globalThis.FormData = formData.FormData;
  globalThis.Blob = formData.Blob;

  // Wrap fetch to accept FormData
  const _fetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    if (options && options.body && options.body instanceof FormData) {
      const encoder = new FormDataEncoder(options.body);
      options.headers = new Headers(options.headers);
      options.headers.set('Content-Type', encoder.contentType);
      options.headers.set('Content-Length', encoder.contentLength);
      const parts = [];
      for await (const part of encoder.encode()) {
        parts.push(part);
      }
      options.body = new _Blob(parts);
    } else if (options && options.body && options.body instanceof Blob) {
      options.body = new _Blob([options.body.arrayBuffer()]);
    }
    // This ignore line here is intentional, but also i put this
    // ignore in at 2:31 am so maybe I am actually wrong.
    // eslint-disable-next-line @typescript-eslint/return-await
    return _fetch(url, options);
  };
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
