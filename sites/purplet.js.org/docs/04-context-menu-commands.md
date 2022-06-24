# Context Menu Commands

Context Menu commands appear as an option in the right-click or long-press menu of Users and Messages. In Purplet, they are structured very closely to Slash Commands, but without the `options` parameter.

## User Commands

User commands target Users or Server Members, which are resolved to a Discord.js [User](https://discord.js.org/#/docs/discord.js/stable/class/User) class.

## Message Commands

Message commands target Messages inside of Text Channels, which are resolved to a Discord.js [Message](https://discord.js.org/#/docs/discord.js/stable/class/Message) class.

## Permissions

[Context Menu Commands have the same permission system as Slash Commands](/docs/slash-commands#permissions).

## Deploying Commands

Commands are not automatically deployed in production, please read Building for Production.
