# Purplet Alternate Discord API Structures

I plan to roll these out as a replacement to `discord.js`. These mirror the API more closely, and do not have a gateway client hooked into to it, they are simply constructed off raw API types and provide methods and getter properties for them. For now, building this to completion is too big of a task for me, especially considering there are more important things for Purplet at the moment. Were this to be finalized, we could build lighter bots, as well as bots that run on cloud functions; but I'm noticing issues with current cloud functions that we might run into anyways, mainly Vercel/Cloudflare having issues with native dependencies. I would love to solve that problem eventually, so anyone could just mindlessly deploy the interaction half of their bot onto a cloud provider to reduce runtime costs.

## Design Differences from Discord.js

- No gateway client at all
- Currently, we use a global object for a connection to a rest client, but this makes things not fully object-oriented. I'm going to reconsider that.
- All structures are immutable, if you need to fetch an update, listen for a gateway event and/or use a structure's `.fetch()` method.
- There are many 'Partial' classes, but they are simply type guards that accept partial API objects, at the cost of hiding certain functions.
- Everything is an ES Module
