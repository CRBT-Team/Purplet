# Purplet Framework Documentation

Purplet is an extremely modular Discord bot building framework. Each bot command or other feature is
built modularly using a system of "Handlers" and "Modules"

For example, a type of handler would be a handler for slash commands. It handles registering a slash
command, and detecting when a user runs the slash command, but nothing about any slash command
itself. An instance of this handler would be something like a "/ping" command. What is powerful about
this approach is the framework bundles some useful handler types, but the developer is allowed to
add their own handlers, which can add more modular systems to the bot.

Let's take a look at defining a slash command, since that is a very common type of interaction.

`src/modules/hello.ts`

```ts
import { ChatCommand } from 'purplet';

export default ChatCommand({
  name: 'hello',
  description: 'A cool command',
  handle(args) {
    this.reply('Hello World');
  },
});
```

The three key things about this:

- The code is placed in the modules folder
- The ChatCommand module is being exported (either the default export, or any named export)
- In the case of ChatCommand, the Interaction object is bound to `this`.

Purplet handles the linking of the Chat Command modules to the Chat Command handler,
and it also allows us to compile the bot down so there aren't dynamic requires or anything weird.
