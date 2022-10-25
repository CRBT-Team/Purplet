# @purplet/polyfill

Modifies global scope to apply polyfills for Node.js and Bun for Web Standards that they do not currently support.

- `fetch` (node <=17)
  - provided by `undici`
  - includes `Request`, `Response`, `FormData`, `Headers`, `File` globals in addition to `fetch`
- `FormData` (node <=17, bun as of v2.1)
  - provided by `formdata-node`, only applied in cases where `fetch` exists but `FormData` is not.
  - `fetch` and `Blob` are patched to support passing `FormData` as a body, with code provided by `form-data-encoder`. (This might break some other uses of `Blob`).
- `WebSocket` (node as of v19)
  - provided by `ws`
- `structuredClone` (node <=17, bun as of v2.1)
  - provided by `@ungap/structured-clone`
- parsing of `.env` files (node)
  - provided by `dotenv`
- `Blob` (node <=17)
  - provided by `node:buffer` on Node.js
- `crypto` (node <=17)
  - provided by `node:crypto` on Node.js
