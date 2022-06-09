# purplet alternate structures

i plan to roll these out as a replacement to `discord.js`. these mirror the api more closely, and do not have a gateway client hooked to it. for now, that is too big of a task, as i would rather prioritize the main framework using existig code. the reason these exist is so we can build lighter bots, as well as bots that run on cloud functions; but i'm noticing issues with cloud functions that we might run into anyways, mainly vercel/cloudflare not supporting native dependencies. i would love to solve that problem too.
