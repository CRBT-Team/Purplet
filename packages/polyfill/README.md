# @purplet/polyfill

Modifies global scope to apply polyfills for Node.js and Bun for Web Standards that they do not currently support.

- `fetch`
  - provided by `undici`
  - includes `Request`, `Response`, `FormData`, `Headers`, `File` globals in addition to `fetch`
- `FormData`
  - provided by `formdata-node`, only applied in cases where `fetch` exists but `FormData` is not.
  - `fetch` and `Blob` are patched to support passing `FormData` as a body, with code provided by `form-data-encoder`. (This might break some other uses of `Blob`).
- `WebSocket`
  - provided by `ws`
- `structuredClone`
  - provided by `@ungap/structured-clone`
- parsing of `.env` files
  - provided by `dotenv`
- `Blob`
  - provided by `node:buffer` on Node.js
- `crypto` (Web Crypto API)
  - provided by `node:crypto` on Node.js
