## 1.0.3
- Fix: `build-dev.mjs`:
  - Using a `fs-extra` function with `fs` only
  - `JSON.stringify`ed the `package.json` to send over to the build.
- Added nicer and more correct build messages.

## 1.0.2
- ChatCommand: make `options` optional.

## 1.0.1
- Bug fix: building a bot with more than one module fails
- Removed handlers folder

## 1.0.0
Initial release. Very basic, no development mode
