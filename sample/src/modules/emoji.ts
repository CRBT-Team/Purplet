import { get, search } from 'node-emoji';
import { ChatCommand, OptionBuilder } from 'purplet';

export const autocomp_test = ChatCommand({
  name: 'get emoji',
  description: 'get an emoji',
  options: new OptionBuilder() //
    .string('name', 'Emoji Name', true)
    .autocomplete('name', (ctx) => {
      return search(ctx.name!)
        .slice(0, 25)
        .map((x) => ({
          value: x.key,
          name: x.key,
        }));
    }),
  handle({ name }) {
    this.reply(`the emoji is ${get(name)}`);
  },
});
