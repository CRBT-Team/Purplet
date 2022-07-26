import { $slashCommand } from 'purplet';
import { config } from 'purplet/env';

export default $slashCommand({
  name: 'self',
  description: 'me',

  async handle(options) {
    this.showMessage(`Config File: \`\`\`json\n${JSON.stringify(config, null, 2)}\`\`\``);
  },
});
