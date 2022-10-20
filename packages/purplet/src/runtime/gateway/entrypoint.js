// Purplet runtime for Node.js/Bun + Gateway
import features from 'purplet/features';
import { setupEnvironment, GatewayBot, isDirectlyRun } from 'purplet/internal';

setupEnvironment();

const bot = new GatewayBot({
  token: process.env.DISCORD_BOT_TOKEN,
});
bot.patchFeatures({ add: features });

// The bot only gets started automatically if you run it directly, otherwise `bot` is
// returned as the default export.
if (isDirectlyRun(import.meta.url)) {
  bot.start({ mode: 'production' });
}

export default bot;
