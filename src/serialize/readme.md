# @davecode/serialize

utilities for binary serialization. these serialize at the bit level instead of the byte level as
most things do, which is used for the purplet component id encoding, since discord limits that to
100 unicode characters. our goal is to create a library that can cram as much info into that limit
as possible.

TODO: republish this fork of my own code.
