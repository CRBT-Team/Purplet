# @davecode/serialize

Utilities for binary serialization, used by Purplet. these serialize at the bit level instead of the byte level as most things do, which is used for the Discord `custom_id` encoding, since Discord limits that to 100 unicode characters. Our goal is to create a library that can cram as much info into that limit as possible.

The naming of this package is due to it originally being a standalone project, but I believe the source code belongs with Purplet, so we can maintain it with it's primary use case.
