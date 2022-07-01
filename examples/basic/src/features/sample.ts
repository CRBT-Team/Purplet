import { OptionBuilder } from 'purplet';

const options1 = new OptionBuilder().string('a', 'b');
const options2 = options1.string('b', 'c');
const options3 = options2.string('c', 'c');

const crash = new OptionBuilder()
  .string('a', '')
  .string('n', '', {
    autocomplete() {
      return [];
    },
  })
  .string('v', '', { choices: Object.fromEntries([]) })
  .string('b', '', { choices: { x: 'a', y: 'b' } })
  .string('c', '', { required: true })
  .boolean('d', '')
  .number('e', '')
  .channel('f', '')
  .attachment('g', '')
  .integer('h', '')
  .mentionable('i', '')
  .user('j', '')
  .role('k', '', { required: true })
  .string('l', '')
  .string('m', '');

declare const x: typeof crash extends OptionBuilder<infer y> ? y : never;
