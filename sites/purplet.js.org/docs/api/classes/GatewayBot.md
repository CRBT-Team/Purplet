---
id: 'GatewayBot'
title: 'Class: GatewayBot'
sidebar_label: 'GatewayBot'
sidebar_position: 0
custom_edit_url: null
---

A GatewayBot represents a bot that is running on a gateway with Discord.js. Features can be loaded and unloaded with `.loadFeatures` and `.unloadFeatures`, respectively. Features may be added after initialization, and will properly hot-swap them, including reconnecting the bot with different intents/config if required.

Assumes the bot token is in the environment variable `DISCORD_BOT_TOKEN`.

## Constructors

### constructor

• **new GatewayBot**(`options`)

#### Parameters

| Name      | Type                                                      |
| :-------- | :-------------------------------------------------------- |
| `options` | [`GatewayBotOptions`](../interfaces/GatewayBotOptions.md) |

#### Defined in

[packages/purplet/src/lib/gateway.ts:69](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L69)

## Properties

### #cachedCommandData

• `Private` `Optional` **#cachedCommandData**: `RESTPostAPIApplicationCommandsJSONBody`[]

#### Defined in

[packages/purplet/src/lib/gateway.ts:51](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L51)

---

### #cleanupHandlers

• `Private` **#cleanupHandlers**: `WeakMap`<[`Feature`](../interfaces/Feature.md), `CleanupHandlers`\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:46](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L46)

---

### #currentDJSOptions

• `Private` `Optional` **#currentDJSOptions**: [`DJSOptions`](../modules.md#djsoptions)

#### Defined in

[packages/purplet/src/lib/gateway.ts:48](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L48)

---

### #currentIntents

• `Private` **#currentIntents**: `number` = `0`

#### Defined in

[packages/purplet/src/lib/gateway.ts:49](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L49)

---

### #djsClient

• `Private` `Optional` **#djsClient**: `Client`<`boolean`\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:47](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L47)

---

### #features

• `Private` **#features**: [`Feature`](../interfaces/Feature.md)[] = `[]`

#### Defined in

[packages/purplet/src/lib/gateway.ts:45](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L45)

---

### #id

• `Private` **#id**: `string` = `''`

#### Defined in

[packages/purplet/src/lib/gateway.ts:50](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L50)

---

### #running

• `Private` **#running**: `boolean` = `false`

#### Defined in

[packages/purplet/src/lib/gateway.ts:43](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L43)

---

### #token

• `Private` **#token**: `string` = `''`

#### Defined in

[packages/purplet/src/lib/gateway.ts:44](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L44)

---

### options

• `Readonly` **options**: [`GatewayBotOptions`](../interfaces/GatewayBotOptions.md)

## Accessors

### djsClient

• `get` **djsClient**(): `undefined` \| `Client`<`boolean`\>

#### Returns

`undefined` \| `Client`<`boolean`\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:65](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L65)

---

### features

• `get` **features**(): readonly [`Feature`](../interfaces/Feature.md)[]

#### Returns

readonly [`Feature`](../interfaces/Feature.md)[]

#### Defined in

[packages/purplet/src/lib/gateway.ts:61](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L61)

---

### id

• `get` **id**(): `string`

#### Returns

`string`

#### Defined in

[packages/purplet/src/lib/gateway.ts:53](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L53)

---

### running

• `get` **running**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/purplet/src/lib/gateway.ts:57](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L57)

## Methods

### loadFeatures

▸ **loadFeatures**(...`features`): `Promise`<`void`\>

Loads one or more features. This can be called after bot startup, and may restart the Discord.js client, if the `intents` or `djsOptions` hooks produce changed outputs.

#### Parameters

| Name          | Type                                    |
| :------------ | :-------------------------------------- |
| `...features` | [`Feature`](../interfaces/Feature.md)[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:342](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L342)

---

### resolveApplicationCommands

▸ `Private` **resolveApplicationCommands**(): `Promise`<`RESTPostAPIApplicationCommandsJSONBody`[]\>

**`internal`**

#### Returns

`Promise`<`RESTPostAPIApplicationCommandsJSONBody`[]\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:199](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L199)

---

### resolveDJSOptions

▸ `Private` **resolveDJSOptions**(): `Promise`<[`DJSOptions`](../modules.md#djsoptions)\>

**`internal`** Resolves what options should be passed to Discord.js using the `djsOptions` hook. Properly handles passing an object around and running the hooks in sequence.

#### Returns

`Promise`<[`DJSOptions`](../modules.md#djsoptions)\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:108](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L108)

---

### resolveGatewayIntents

▸ `Private` **resolveGatewayIntents**(): `Promise`<`number`\>

**`internal`** Resolves what gateway intents are desired using the `intents` hook.

#### Returns

`Promise`<`number`\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:94](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L94)

---

### restartDJSClient

▸ `Private` **restartDJSClient**(): `Promise`<`void`\>

**`internal`** Starts or Restarts the Discord.JS client, assuming that `.#currentDJSOptions` is set.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:264](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L264)

---

### runCleanupHandler

▸ `Private` **runCleanupHandler**(`feature`, `id`): `Promise`<`void`\>

**`internal`** Runs a previously saved cleanup handler for a feature

#### Parameters

| Name      | Type                                  |
| :-------- | :------------------------------------ |
| `feature` | [`Feature`](../interfaces/Feature.md) |
| `id`      | keyof `CleanupHandlers`               |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:83](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L83)

---

### runLifecycleHook

▸ `Private` **runLifecycleHook**<`Event`\>(`features`, `hook`, `data?`): `Promise`<`void`\>

**`internal`** Runs a lifecycle hook on an array of features. A lifecycle hook is one that may return a cleanup handler, and such those handlers are saved using `.setCleanupHandler`.

#### Type parameters

| Name    |
| :------ |
| `Event` |

#### Parameters

| Name       | Type                                                     |
| :--------- | :------------------------------------------------------- |
| `features` | [`Feature`](../interfaces/Feature.md)[]                  |
| `hook`     | [`LifecycleHookNames`](../modules.md#lifecyclehooknames) |
| `data?`    | `Event`                                                  |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:142](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L142)

---

### setCleanupHandler

▸ `Private` **setCleanupHandler**(`feature`, `id`, `handler`): `void`

**`internal`** Saves a cleanup handler for a feature in the #cleanupHandlers

#### Parameters

| Name      | Type                                  |
| :-------- | :------------------------------------ |
| `feature` | [`Feature`](../interfaces/Feature.md) |
| `id`      | keyof `CleanupHandlers`               |
| `handler` | [`Cleanup`](../modules.md#cleanup)    |

#### Returns

`void`

#### Defined in

[packages/purplet/src/lib/gateway.ts:72](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L72)

---

### shouldRestartDJSClient

▸ `Private` **shouldRestartDJSClient**(): `Promise`<`boolean`\>

**`internal`** Re-runs `intent` and `djsConfig` hooks and returns a boolean if the Discord.js client should be restarted.

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:317](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L317)

---

### start

▸ **start**(): `Promise`<`void`\>

Starts the gateway bot. Run the first set of `.loadFeatures` _before_ using this.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:157](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L157)

---

### stop

▸ **stop**(): `Promise`<`void`\>

Gracefully stop the bot.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:388](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L388)

---

### unloadFeatures

▸ **unloadFeatures**(...`features`): `Promise`<`void`\>

Unloads features. By default, this does not cause Discord.js to restart like loading features would.

#### Parameters

| Name          | Type                                    |
| :------------ | :-------------------------------------- |
| `...features` | [`Feature`](../interfaces/Feature.md)[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:367](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L367)

---

### unloadFeaturesFromFile

▸ **unloadFeaturesFromFile**(`filename`): `Promise`<`void`\>

Unloads all features associated with a given filename.

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `filename` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:383](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L383)

---

### updateApplicationCommands

▸ `Private` **updateApplicationCommands**(): `Promise`<`void`\>

**`internal`**

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/purplet/src/lib/gateway.ts:212](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/gateway.ts#L212)
