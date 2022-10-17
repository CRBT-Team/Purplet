// Purplet runtime for Node.js/Bun + Gateway
import { allFeatures } from 'purplet/generated-build';
import { GatewayBot, isDirectlyRun } from 'purplet/internal';

const bot = new GatewayBot();
bot.loadFeatures(...allFeatures);

// The bot only gets started automatically if you run it directly, otherwise `bot` is
// returned as the default export.
if (isDirectlyRun(import.meta.url)) {
  bot.start({ mode: 'production' });
}

export default bot;
