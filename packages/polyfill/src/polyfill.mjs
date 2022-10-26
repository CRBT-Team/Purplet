// @ts-nocheck This file messes with lots of globals and basically every line is a type error.
export function polyfill(require) {
  const path = require('path');

  // Disable node.js warnings
  if (typeof process !== 'undefined' && !process.isBun) {
    const originalEmit = process.emit;
    process.emit = function (name, data, ...args) {
      if (name === `warning` && typeof data === `object` && data.name === `ExperimentalWarning`) {
        return false;
      }
      return originalEmit.apply(process, [name, data, ...args]);
    };
  }

  // Blob is not global in node <=17
  if (typeof Blob === 'undefined') {
    const { Blob } = require('node:buffer');
    globalThis.Blob = Blob;
  }

  // Fetch is not available in node <=17
  if (typeof fetch === 'undefined') {
    const undici = require('undici');
    // Always apply everything here just in case undici and the implementation won't play nice
    globalThis.fetch = undici.fetch;
    globalThis.Request = undici.Request;
    globalThis.Response = undici.Response;
    globalThis.FormData = undici.FormData;
    globalThis.Headers = undici.Headers;
    globalThis.File = undici.File;
  }
  // FormData is not available in node <=16 in bun as of 0.2.1
  else if (typeof FormData === 'undefined') {
    const _Blob = globalThis.Blob;
    // Until https://github.com/oven-sh/bun/issues/1337 is resolved, we have to force this.
    const { FormData, Blob } = require(path.resolve(
      require.resolve('formdata-node'),
      '../index.js'
    ));
    // const { FormData, Blob } = require('formdata-node');
    globalThis.FormData = FormData;
    globalThis.Blob = Blob;

    // In order to use `FormData` with `fetch`, we need to wrap fetch and encode the data manually.
    const { FormDataEncoder } = require('form-data-encoder');
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
      return _fetch(url, options);
    };
  }

  // Websocket is not available in any node version as of v19
  if (typeof WebSocket === 'undefined') {
    const ws = require('ws');
    globalThis.WebSocket = ws.default;
  }

  // structuredClone is not available in node <=16 and bun as of 0.2.1
  if (typeof structuredClone === 'undefined') {
    const structuredClone = require('@ungap/structured-clone');
    globalThis.structuredClone = structuredClone.default;
  }

  // crypto is not a global variable in node <=18
  if (typeof crypto === 'undefined') {
    const crypto = require('node:crypto');
    globalThis.crypto = crypto.webcrypto;
  }

  // run dotenv on node specifically, since bun does this for us
  if (typeof process !== 'undefined' && !process.isBun) {
    require('dotenv/config');
  }
}
