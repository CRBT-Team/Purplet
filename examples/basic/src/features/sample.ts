import { $mentionCommand, $slashCommand } from 'purplet';

export default $slashCommand({
  name: 'test',
  description: 'test with purplet structures',
  async handle() {
    this.showMessage({
      content: `This command was run by ${this.user}. Using purplet provided structures now!!!`,
    });
  },
});

export const mentionCommand = $mentionCommand({
  name: 'test-cmd',
  async handle(args) {
    console.log(args);
  },
});
