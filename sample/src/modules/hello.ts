import { ChatCommand, OptionBuilder } from 'purplet';

let number = 0;

export const test_get = ChatCommand({
  name: 'test get',
  description: 'Get the value',
  handle(args) {
    this.reply(`the value is ${number}`);
  },
});

export const test_set = ChatCommand({
  name: 'test set',
  description: 'Set the value',
  options: new OptionBuilder().number('value', 'The value to set', true),
  handle({ value }) {
    this.reply(`setting value to ${value}`);
    number = value;
  },
});
