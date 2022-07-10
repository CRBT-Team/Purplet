# @purplet/polyfill

Modifies global scope to apply polyfills for Node.js and Bun for Web Standards that they do not currently support.

- `fetch`
  - provided by `undici`
  - includes `Request`, `Response`, `FormData`, `Headers`, `File` globals in addition to `fetch`
- `FormData`
  - provided by `form-data`
  - only applied for Bun, since they are the only runtime that has `fetch` but not `FormData`. We use a separate package since Bun overrides `undici` and does not yet support `FormData`.
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
