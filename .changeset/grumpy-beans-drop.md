---
'@purplet/serialize': major
---

Rewrite library to be cleaner

- Fixed unsafe unicode encoding, and it is now the only method used, since it works properly with discord now. I think it was a decoding bug on my end that made it not work right.
- `BitArray` renamed to `BitBuffer`; operates directly on an `Uint8Array` instead of an array of 1s and 0s.
- Each serializer is an instance of a class, which provides extra methods to easily convert between serialized data, `Uint8Array`s, and also base1114111 `custom_id` strings.
- Documentation
