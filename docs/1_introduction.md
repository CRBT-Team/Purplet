# Purplet Framework Documentation

Purplet is an extremely modular Discord bot building framework. Each bot command or other feature is
built modularly using a system of "Handlers" and "Features"

For example, a type of handler would be a handler for slash commands. It handles registering a slash
command, and detecting when a user runs the slash command, but nothing about any slash command
itself. An instance of this handler would be something like a "/ping" command. What is powerful about
this approach is the framework bundles some useful handler types, but the developer is allowed to
add their own handlers, which can add more modular systems to the bot.

Let's take a look at defining a slash command, since that is a very common type of interaction.

`src/features/hello.ts`

```ts
import { $slashCommand } from 'purplet';

export default $slashCommand({
  name: 'hello',
  description: 'A simple "Hello, World" command.',

  async handle() {
    this.reply('Hello, World!');
  },
});
```

The three key things about this:

- The code is placed in the features folder
- The $slashCommand module is being exported (either the default export, or any named export)
- In the case of $slashCommand, the Interaction object is bound to `this`.

Purplet handles the linking of the Slash Command features to the Slash Command handler,
and it also allows us to compile the bot down so there aren't dynamic requires or anything weird.
