# Core API Hooks

This page documents the seven "core hooks" that Purplet provides. These are hardcoded into the internal `GatewayBot` class, with manual code to support hot-reloading. Thus, anything built on top of it is automatically hot-reloadable. All of these hooks are accessed through `createFeature`, which creates a feature object.

## `initialize`

This is the first hook that is called for your bot, and is always called. This hook allows for a cleanup function, which you should use to remove event handlers.

**Example:**

```ts
createFeature({
  initialize(data) {
    console.log(`Feature id is ${data.featureId}`);

    return () => {
      console.log('Cleaning up');
    };
  },
});
```

## `interaction`

Called for incoming interactions, ~~and does not explicity rely on Discord.js, meaning bots using this hook can theoretically be deployed to a cloud function and called over HTTPs.~~ Currently passes a Discord.js interaction object.

**Example:**

```ts
createFeature({
  interaction(i) {
    if (i.isCommand()) {
      i.reply('You ran a command!');
    }
  },
});
```

## `gatewayEvent`

An object mapping raw gateway event types to functions to handle them, does not explicity rely on Discord.js, meaning bots using this hook instead of `djsClient` can theoretically run without needing to use Discord.js. `INTERACTION_CREATE` is not emitted, as you should be using the `interaction` hook for that.

Specifying this hook will cause a gateway client to be setup. This is currently done through Discord.js.

**Example:**

```ts
createFeature({
  gatewayEvent: {
    MESSAGE_CREATE(ev) {
      // ... do something with raw event
    },
  },
});
```

## `applicationCommands`

Called to resolve this feature's application commands. Return an array of commands to be registered to Discord. If your command is not returned here, it may be deleted.

In development mode, you must set the `UNSTABLE_PURPLET_COMMAND_GUILDS` environment variable to a comma separated list of guild IDs to register commands to. Commands may also cleared on bot shutdown.

Currently, only global application commands are supported. You can manually use the REST API to add guild-level ones, but this will interfere with development mode's behavior of overwriting commands.

```ts
createFeature({
  applicationCommands: [
    {
      type: ApplicationCommandType.ChatInput,
      name: 'hello',
      description: 'hello world',
    },
  ],
});
```

## `intents`

This hook allows you to specify what gateway intents your gateway bot requires. Does not assume a Discord.js environment, and will trigger on either using Discord.js, or the `gatewayEvents` hook.

```ts
createFeature({
  // Can be a function, array, or function that returns an array, or a single number.
  intents: GatewayIntentBits.MessageContent,
});
```

## `djsClient`

Called on load with a Discord.js client. Specifying this hook will cause the Discord.js client to be setup. This hook allows for a cleanup function, which you should use to remove event handlers.

:::note

If this hook is not specified anywhere in your project, a Discord.js client may not be created.

:::

```ts
createFeature({
  djsClient(client) {
    function handler(msg: Message) {
      // handle message ...
    }

    client.on('messageCreate', handler);
    return () => client.off('messageCreate', handler);
  },
});
```

## `djsOptions`

Called before the Discord.js client is created, passing a configuration object. You are able to return or modify the configuration object, and that will be passed to Discord.js. Do not configure gateway intents with this hook, and use the separate gateway intents hook instead.

:::note

This hook will only be called if some feature in your project requests the Discord.js client through use of the other hooks.

:::
