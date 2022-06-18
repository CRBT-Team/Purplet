---
id: 'Feature'
title: 'Interface: Feature'
sidebar_label: 'Feature'
sidebar_position: 0
custom_edit_url: null
---

Represents a fully anno.

## Hierarchy

- [`FeatureData`](FeatureData.md)

  ↳ **`Feature`**

## Properties

### [IS\_FEATURE]

• **[IS\_FEATURE]**: `true`

#### Defined in

[packages/purplet/src/lib/feature.ts:92](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L92)

---

### applicationCommands

• `Optional` **applicationCommands**: [`DataHook`](../modules.md#datahook)<`RESTPostAPIApplicationCommandsJSONBody`[]\>

Called to resolve this feature's application commands. Return an array of commands to be registered to Discord. If your command is not returned here, it may be deleted.

In development mode, you must set the `UNSTABLE_PURPLET_COMMAND_GUILDS` environment variable to a comma separated list of guild IDs to register commands to. Commands may also cleared on bot shutdown.

Currently, only global application commands are supported. You can manually use the REST API to add guild-level ones, but this will interfere with development mode's behavior of overwriting commands.

#### Inherited from

[FeatureData](FeatureData.md).[applicationCommands](FeatureData.md#applicationcommands)

#### Defined in

[packages/purplet/src/lib/feature.ts:77](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L77)

---

### djsClient

• `Optional` **djsClient**: [`LifecycleHook`](../modules.md#lifecyclehook)<`Client`<`boolean`\>\>

Called on load with a Discord.js client. Specifying this hook will cause the Discord.js client to be setup. This hook allows for a cleanup function, which you should use to remove event handlers.

#### Inherited from

[FeatureData](FeatureData.md).[djsClient](FeatureData.md#djsclient)

#### Defined in

[packages/purplet/src/lib/feature.ts:44](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L44)

---

### djsOptions

• `Optional` **djsOptions**: [`EventHook`](../modules.md#eventhook)<[`DJSOptions`](../modules.md#djsoptions), `void` \| [`DJSOptions`](../modules.md#djsoptions)\>

Called before the Discord.js client is created, passing a configuration object. You are able to return or modify the configuration object, and that will be passed to Discord.js. Do not configure gateway intents with this hook, and use the separate gateway intents hook instead.

Note: this hook will only be called if some feature in your project requests the Discord.js client.

#### Inherited from

[FeatureData](FeatureData.md).[djsOptions](FeatureData.md#djsoptions)

#### Defined in

[packages/purplet/src/lib/feature.ts:52](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L52)

---

### exportId

• **exportId**: `string`

The id of the export that contained this feature.

#### Defined in

[packages/purplet/src/lib/feature.ts:96](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L96)

---

### featureId

• **featureId**: `string`

A generated ID based on the `filename` and `exportId`.

#### Defined in

[packages/purplet/src/lib/feature.ts:98](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L98)

---

### filename

• **filename**: `string`

The full path to this module's source file.

#### Defined in

[packages/purplet/src/lib/feature.ts:94](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L94)

---

### gatewayEvent

• `Optional` **gatewayEvent**: [`GatewayEventHook`](GatewayEventHook.md)

An object mapping gateway event types to functions to handle them, does not explicity rely on Discord.js, meaning bots using this hook instead of `djsClient` can theoretically run without needing to use Discord.js. `INTERACTION_CREATE` is not emitted, as you should be using the `interaction` hook for that.

Specifying this hook will cause a gateway client to be setup, currently that is Discord.js.

#### Inherited from

[FeatureData](FeatureData.md).[gatewayEvent](FeatureData.md#gatewayevent)

#### Defined in

[packages/purplet/src/lib/feature.ts:66](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L66)

---

### initialize

• `Optional` **initialize**: [`LifecycleHook`](../modules.md#lifecyclehook)<`void`\>

This is the first hook that is called for your bot, and is always called. This hook allows for a cleanup function, which you should use to remove event handlers.

#### Inherited from

[FeatureData](FeatureData.md).[initialize](FeatureData.md#initialize)

#### Defined in

[packages/purplet/src/lib/feature.ts:39](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L39)

---

### intents

• `Optional` **intents**: [`DataHook`](../modules.md#datahook)<[`IntentResolvable`](../modules.md#intentresolvable)\>

This hook allows you to specify what gateway intents your gateway bot requires. Does not assume a Discord.js environment, and will trigger on either using Discord.js, or the `gatewayEvents` hook.

#### Inherited from

[FeatureData](FeatureData.md).[intents](FeatureData.md#intents)

#### Defined in

[packages/purplet/src/lib/feature.ts:82](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L82)

---

### interaction

• `Optional` **interaction**: [`EventHook`](../modules.md#eventhook)<`Interaction`<`CacheType`\>, `void` \| `APIInteractionResponse`\>

Called for incoming interactions, and does not explicity rely on Discord.js, meaning bots using this hook can theoretically be deployed to a cloud function and called over HTTPs.

#### Inherited from

[FeatureData](FeatureData.md).[interaction](FeatureData.md#interaction)

#### Defined in

[packages/purplet/src/lib/feature.ts:57](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L57)

---

### name

• `Optional` **name**: `string`

Name of this feature, as see in some debug menus.

#### Inherited from

[FeatureData](FeatureData.md).[name](FeatureData.md#name)

#### Defined in

[packages/purplet/src/lib/feature.ts:34](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L34)
