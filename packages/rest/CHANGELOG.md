# `@purplet/rest`

## 1.0.2

### Minor Changes

- implement handling of 429 errors ([#63](https://github.com/CRBT-Team/Purplet/pull/63))

- Add types for `channel.listJoinedPrivateArchivedThreads` ([`bbbe1b1`](https://github.com/CRBT-Team/Purplet/commit/bbbe1b18de07dab0c4921a78f7b1ee6a1b63f293))

### Patch Changes

- fix: ratelimit errors due to rounding the reset time ([#63](https://github.com/CRBT-Team/Purplet/pull/63))

* fix: ignore `undefined` as a query string value ([#63](https://github.com/CRBT-Team/Purplet/pull/63))

* fix: no longer parses 204 no content as JSON data. ([#55](https://github.com/CRBT-Team/Purplet/pull/55))

## 1.0.1

### Patch Changes

- move @davecode/types to be a required dependency ([`20b20d5`](https://github.com/CRBT-Team/Purplet/commit/20b20d564234091974bc0af18f1fe4d92152271c))

## 1.0.0

Initial release.
