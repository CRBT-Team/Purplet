# @purplet/serialize

> Formerly named `@davecode/serialize`

Utilities for binary serialization, used by Purplet, in an effort to cram as much data into Discord's `custom_id` as possible. The limit is currently 250 bytes per id.

Alongside the `Uint8Array` <-> `string` encoder we use for `custom_id`, this library also includes a handful of utilities for compressing JSON data into `Uint8Array`s, offering a generic solution as a replacement for `JSON.stringify` but also customizable serializers to create even smaller payloads.

The naming of this package is due to it originally being a standalone project, but I believe the source code belongs within the Purplet monorepo, so we can maintain it with its primary use case.
