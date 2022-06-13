---
id: "FeatureData"
title: "Interface: FeatureData"
sidebar_label: "FeatureData"
sidebar_position: 0
custom_edit_url: null
---

A feature represents anything that contributes to the bot's functionality. In purplet, features
achieve action through a small set of hooks that let you tie into Discord.js and Purplet's own
API. They look very similar to vite and rollup plugins.

Also, there is some extra data about your feature available as `this` inside of the hooks, so I'd
stray away from using arrow functions for that, plus it looks nicer with the method shorthand.

## Hierarchy

- **`FeatureData`**

  ↳ [`Feature`](Feature.md)

## Properties

### applicationCommands

• `Optional` **applicationCommands**: [`DataHook`](../modules.md#datahook)<`RESTPostAPIApplicationCommandsJSONBody`[]\>

Called to resolve this feature's application commands. Return an array of commands to be
registered to Discord. If your command is not returned here, it may be deleted.

In development mode, you must set the `UNSTABLE_PURPLET_COMMAND_GUILDS` environment variable to
a comma separated list of guild IDs to register commands to. Commands may also cleared on bot shutdown.

Currently, only global application commands are supported. You can manually use the REST API to
add guild-level ones, but this will interfere with development mode's behavior of overwriting commands.

#### Defined in

[packages/purplet/src/lib/feature.ts:77](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L77)

___

### djsClient

• `Optional` **djsClient**: [`LifecycleHook`](../modules.md#lifecyclehook)<`Client`<`boolean`\>\>

Called on load with a Discord.js client. Specifying this hook will cause the Discord.js client
to be setup. This hook allows for a cleanup function, which you should use to remove event handlers.

#### Defined in

[packages/purplet/src/lib/feature.ts:44](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L44)

___

### djsOptions

• `Optional` **djsOptions**: [`EventHook`](../modules.md#eventhook)<[`DJSOptions`](../modules.md#djsoptions), `void` \| [`DJSOptions`](../modules.md#djsoptions)\>

Called before the Discord.js client is created, passing a configuration object. You are able to
return or modify the configuration object, and that will be passed to Discord.js. Do not
configure gateway intents with this hook, and use the separate gateway intents hook instead.

Note: this hook will only be called if some feature in your project requests the Discord.js client.

#### Defined in

[packages/purplet/src/lib/feature.ts:52](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L52)

___

### gatewayEvent

• `Optional` **gatewayEvent**: [`GatewayEventHook`](GatewayEventHook.md)

An object mapping gateway event types to functions to handle them, does not explicity rely on
Discord.js, meaning bots using this hook instead of `djsClient` can theoretically run without
needing to use Discord.js. `INTERACTION_CREATE` is not emitted, as you should be using the
`interaction` hook for that.

Specifying this hook will cause a gateway client to be setup, currently that is Discord.js.

#### Defined in

[packages/purplet/src/lib/feature.ts:66](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L66)

___

### initialize

• `Optional` **initialize**: [`LifecycleHook`](../modules.md#lifecyclehook)<`void`\>

This is the first hook that is called for your bot, and is always called. This hook allows for
a cleanup function, which you should use to remove event handlers.

#### Defined in

[packages/purplet/src/lib/feature.ts:39](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L39)

___

### intents

• `Optional` **intents**: [`DataHook`](../modules.md#datahook)<[`IntentResolvable`](../modules.md#intentresolvable)\>

This hook allows you to specify what gateway intents your gateway bot requires. Does not assume
a Discord.js environment, and will trigger on either using Discord.js, or the `gatewayEvents` hook.

#### Defined in

[packages/purplet/src/lib/feature.ts:82](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L82)

___

### interaction

• `Optional` **interaction**: [`EventHook`](../modules.md#eventhook)<`Interaction`<`CacheType`\>, `void` \| `APIInteractionResponse`\>

Called for incoming interactions, and does not explicity rely on Discord.js, meaning bots using
this hook can theoretically be deployed to a cloud function and called over HTTPs.

#### Defined in

[packages/purplet/src/lib/feature.ts:57](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L57)

___

### name

• `Optional` **name**: `string`

Name of this feature, as see in some debug menus.

#### Defined in

[packages/purplet/src/lib/feature.ts:34](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L34)
