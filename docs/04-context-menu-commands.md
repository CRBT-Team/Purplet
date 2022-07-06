# Context Menu Commands

Context Menu commands appear as an option in the right-click or long-press menu of Users and Messages. In Purplet, they are structured very closely to Slash Commands, but without the `options` parameter.

## User Commands

User commands target Users or Server Members, which are resolved to a User class.

```ts title='src/features/user-command.ts'
import { $userCommand } from 'purplet';

export default $userContextCommand({
  name: 'Get User Info',
  handle(user) {
    this.reply(`Selected user is ${user.tag}`);
  }
});
```

## Message Commands

Message commands target Messages inside of Text Channels, which are resolved to a Message class.

```ts title='src/features/message-command.ts'
import { $userCommand } from 'purplet';

export default $messageContextCommand({
  name: 'Get Author Info',
  handle(message) {
    this.reply(`Selected message was sent by ${message.author.tag}`);
  }
});
```

## Permissions

[Context Menu Commands have the same permission system as Slash Commands](/docs/slash-commands#permissions).

## Deploying Commands

Commands are not automatically deployed in production, please read Building for Production.
