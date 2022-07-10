# @purplet/node-polyfill

Modifies global scope to apply these missing global variables, mainly targeting Node.js, but also applies to bun.

- from `undici`
  - `fetch`
  - `Request`
  - `Response`
  - `FormData`
  - `Headers`
  - `File`
- from `ws`
  - `WebSocket`
- from `@ungap/structured-clone`
  - `structuredClone`
- from `dotenv`
  - parsing of `.env` files
- from `node:buffer`
  - `Blob`
- from `node:crypto`
  - `crypto` (Web Crypto API)
