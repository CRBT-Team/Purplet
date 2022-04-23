import { Interaction, InteractionReplyOptions } from 'discord.js';
import { ButtonComponent, ChatCommand, components, OptionBuilder, row } from 'purplet';

interface Game {
  p1: string;
  p2: string;
  // true = 1, false = 2, null = blank
  board: (boolean | null)[];
  turn: boolean;
}

interface GameButtonContext {
  id: number;
  game: Game;
}

export default ChatCommand({
  name: 'play tictactoe',
  description: 'Play TicTacToe powered by Purplet Components',
  options: new OptionBuilder().user('with', 'The user to play with'),
  async handle(opts) {
    const game: Game = {
      p1: this.user.id,
      p2: opts.with.id,
      board: [null, null, null, null, null, null, null, null, null],
      turn: true,
    };

    this.reply(await render(this, game));
  },
});

export const GameButton = ButtonComponent({
  async handle(ctx: GameButtonContext) {
    const { id, game } = ctx;
    if (game.board[id] !== null) {
      return this.update();
    }

    const turnId = game.turn ? game.p1 : game.p2;
    if (turnId !== this.user.id) {
      return this.update();
    }

    game.board[id] = game.turn;
    game.turn = !game.turn;

    const result = await render(this, game);
    this.update(result);
  },
});

function renderButton(game: Game, index: number) {
  const value = game.board[index];
  const symbol = value === true ? 'X' : value === false ? 'O' : ' ';

  return new GameButton({
    id: index,
    game,
  })
    .setLabel(symbol)
    .setStyle(symbol === ' ' ? 'SECONDARY' : symbol === 'X' ? 'DANGER' : 'SUCCESS');
}

async function render(i: Interaction, game: Game): Promise<InteractionReplyOptions> {
  const p1name = await i.client.users.fetch(game.p1).then((u) => u.username);
  const p2name = await i.client.users.fetch(game.p2).then((u) => u.username);

  return {
    content: `${p1name} vs ${p2name}\n${game.turn ? p1name : p2name}'s turn`,
    components: components(
      row(renderButton(game, 0), renderButton(game, 1), renderButton(game, 2)),
      row(renderButton(game, 3), renderButton(game, 4), renderButton(game, 5)),
      row(renderButton(game, 6), renderButton(game, 7), renderButton(game, 8))
    ),
  };
}
