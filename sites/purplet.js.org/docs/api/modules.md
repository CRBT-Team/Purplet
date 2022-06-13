---
id: "modules"
title: "purplet"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Classes

- [GatewayBot](classes/GatewayBot.md)
- [MessageComponentBuilder](classes/MessageComponentBuilder.md)
- [ModalComponentBuilder](classes/ModalComponentBuilder.md)

## Interfaces

- [ApplicationCommandHookData](interfaces/ApplicationCommandHookData.md)
- [AutocompleteOption](interfaces/AutocompleteOption.md)
- [BaseOption](interfaces/BaseOption.md)
- [ChannelOption](interfaces/ChannelOption.md)
- [ChatCommandData](interfaces/ChatCommandData.md)
- [Choice](interfaces/Choice.md)
- [ContextCommandOptions](interfaces/ContextCommandOptions.md)
- [Feature](interfaces/Feature.md)
- [FeatureData](interfaces/FeatureData.md)
- [GatewayBotOptions](interfaces/GatewayBotOptions.md)
- [GatewayEventHook](interfaces/GatewayEventHook.md)
- [MessageCommandOptions](interfaces/MessageCommandOptions.md)
- [NumericOption](interfaces/NumericOption.md)
- [OptionInputs](interfaces/OptionInputs.md)
- [ServiceOptions](interfaces/ServiceOptions.md)
- [UserCommandOptions](interfaces/UserCommandOptions.md)

## Type Aliases

### ApplicationCommandData

Ƭ **ApplicationCommandData**: `RESTPostAPIApplicationCommandsJSONBody`

#### Defined in

[packages/purplet/src/lib/feature.ts:20](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L20)

___

### AssertOptionInputsCorrect

Ƭ **AssertOptionInputsCorrect**: typeof `ApplicationCommandOptionType`[`Capitalize`<keyof [`OptionInputs`](interfaces/OptionInputs.md)\>] extends `number` ? ``"PASS"`` : ``"FAIL"``

**`internal`** This type MUST only be equal to "PASS", if it includes "FAIL" then the above type is incorrect.

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:42](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L42)

___

### Autocomplete

Ƭ **Autocomplete**<`Context`, `Type`\>: (`this`: `AutocompleteInteraction`, `ctx`: `Context`) => `Awaitable`<[`Choice`](interfaces/Choice.md)<`Type`\>[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Context` | ``null`` |
| `Type` | `unknown` |

#### Type declaration

▸ (`this`, `ctx`): `Awaitable`<[`Choice`](interfaces/Choice.md)<`Type`\>[]\>

Represents an option autocomplete handler passed to `.autocomplete` on an option builder's
options argument. This function gets called on autocomplete interactions tied to whatever command
option you pass it to.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `AutocompleteInteraction` |
| `ctx` | `Context` |

##### Returns

`Awaitable`<[`Choice`](interfaces/Choice.md)<`Type`\>[]\>

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:99](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L99)

___

### Cleanup

Ƭ **Cleanup**: () => `void` \| `undefined` \| `void`

#### Defined in

[packages/purplet/src/utils/types.ts:1](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/utils/types.ts#L1)

___

### Config

Ƭ **Config**: `DeepPartial`<`ResolvedConfig`\>

#### Defined in

[packages/purplet/src/config/options.ts:14](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/config/options.ts#L14)

___

### DJSOptions

Ƭ **DJSOptions**: `Omit`<`ClientOptions`, ``"intents"``\>

#### Defined in

[packages/purplet/src/lib/feature.ts:19](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L19)

___

### DataHook

Ƭ **DataHook**<`T`\>: (`this`: [`Feature`](interfaces/Feature.md)) => `Awaitable`<`T`\> \| `Awaitable`<`T`\>

Data hooks can be either functions that resolve to data, or just data themselves.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[packages/purplet/src/lib/feature.ts:17](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L17)

___

### EnumOption

Ƭ **EnumOption**<`T`\>: [`AutocompleteOption`](interfaces/AutocompleteOption.md)<`T`\> \| { `choiceLocalizations?`: `Record`<`T`, `LocalizationMap`\> ; `choices`: `Record`<`T`, `string`\>  } & [`BaseOption`](interfaces/BaseOption.md)

**`internal`** Used for `OptionInputs`. Enum Options as I call them are anything with a dropdown list.
In Discord, this is done with a `choices` list or `autocomplete` handler.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `number` |

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:62](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L62)

___

### EventHook

Ƭ **EventHook**<`E`, `R`\>: (`this`: [`Feature`](interfaces/Feature.md), `ctx`: `E`) => `Awaitable`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | `E` |
| `R` | `void` |

#### Type declaration

▸ (`this`, `ctx`): `Awaitable`<`R`\>

Event hooks run multiple times, and are passed an event object, they can also return stuff.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Feature`](interfaces/Feature.md) |
| `ctx` | `E` |

##### Returns

`Awaitable`<`R`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:15](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L15)

___

### IntentResolvable

Ƭ **IntentResolvable**: `number` \| `number`[]

#### Defined in

[packages/purplet/src/lib/feature.ts:22](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L22)

___

### LifecycleHook

Ƭ **LifecycleHook**<`E`\>: (`this`: [`Feature`](interfaces/Feature.md), `event`: `E`) => `Awaitable`<[`Cleanup`](modules.md#cleanup)\>

#### Type parameters

| Name |
| :------ |
| `E` |

#### Type declaration

▸ (`this`, `event`): `Awaitable`<[`Cleanup`](modules.md#cleanup)\>

Lifecycle hooks run once, and can provide a cleanup function.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`Feature`](interfaces/Feature.md) |
| `event` | `E` |

##### Returns

`Awaitable`<[`Cleanup`](modules.md#cleanup)\>

#### Defined in

[packages/purplet/src/lib/feature.ts:13](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L13)

___

### LifecycleHookNames

Ƭ **LifecycleHookNames**: ``"initialize"`` \| ``"djsClient"``

#### Defined in

[packages/purplet/src/lib/feature.ts:102](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L102)

___

### MarkedFeature

Ƭ **MarkedFeature**<`T`\>: { `[IS_FEATURE]`: ``true``  } & `T`

Represents feature data that has gone through `createFeature` but not annotated by `moduleToFeatureArray`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `Record`<`never`, `unknown`\> |

#### Defined in

[packages/purplet/src/lib/feature.ts:86](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L86)

___

### OptionBuilder

Ƭ **OptionBuilder**<`Options`\>: { [Type in keyof OptionInputs]: OptionBuilderMethod<Options, Type\> } & { `toJSON`: () => `APIApplicationCommandOption`[]  }

`OptionBuilder` is an advanced builder class for `CHAT_INPUT` command's `options` property,
keeping track of all the options you pass to it in a type parameter, which is extracted by
`$slashCommand` to give you rich option types.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Options` | {} |

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:134](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L134)

___

### OptionBuilderEntryToDJSResolved

Ƭ **OptionBuilderEntryToDJSResolved**<`X`\>: `X` extends { `type`: infer T  } ? { `10`: `number` ; `11`: `Attachment` ; `3`: `string` ; `4`: `number` ; `5`: `boolean` ; `6`: `User` ; `7`: `Channel` ; `8`: `Role` ; `9`: `User` \| `Role`  }[`T`] : `X` extends { `enum`: infer T  } ? `T` : `never`

"DJSResolved" refers to the resolved value given with `$slashCommand`

#### Type parameters

| Name |
| :------ |
| `X` |

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:247](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L247)

___

### OptionBuilderEntryToPurpletResolved

Ƭ **OptionBuilderEntryToPurpletResolved**<`X`\>: `X` extends { `type`: infer T  } ? { `10`: `number` ; `11`: `APIAttachment` ; `3`: `string` ; `4`: `number` ; `5`: `boolean` ; `6`: `InteractionUser` ; `7`: `APIInteractionDataResolvedChannel` ; `8`: `APIRole` ; `9`: `APIUser` \| `APIRole`  }[`T`] : `X` extends { `enum`: infer T  } ? `T` : `never`

"PurpletResolved" is unused.

#### Type parameters

| Name |
| :------ |
| `X` |

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:227](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L227)

___

### OptionBuilderEntryToUnresolved

Ƭ **OptionBuilderEntryToUnresolved**<`X`\>: `X` extends { `type`: infer T  } ? { `10`: `number` ; `11`: `string` ; `3`: `string` ; `4`: `number` ; `5`: `boolean` ; `6`: `BareUser` ; `7`: `string` ; `8`: `string` ; `9`: `string`  }[`T`] : `X` extends { `enum`: infer T  } ? `T` : `never`

"Unresolved" refers to the raw `value` property given in an interaction.

#### Type parameters

| Name |
| :------ |
| `X` |

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:207](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L207)

___

### OptionBuilderMethod

Ƭ **OptionBuilderMethod**<`CurrentOptions`, `MethodName`\>: <Key, OptionOptions, IsRequired\>(`key`: `Key`, `desc`: `string`, `options?`: `OptionOptions` & { `required?`: `IsRequired`  }) => [`OptionBuilder`](modules.md#optionbuilder-1)<`ForceSimplify`<`CurrentOptions` & [`RequiredIf`](modules.md#requiredif)<`IsRequired`, `Record`<`Key`, `OptionOptions` extends [`EnumOption`](modules.md#enumoption)<`unknown`, `unknown`, infer T\> ? `T` extends `string` ? { `enum`: `T`  } : { `type`: typeof `ApplicationCommandOptionType`[`Capitalize`<`MethodName`\>]  } : { `type`: typeof `ApplicationCommandOptionType`[`Capitalize`<`MethodName`\>]  }\>\>\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CurrentOptions` | `CurrentOptions` |
| `MethodName` | extends keyof [`OptionInputs`](interfaces/OptionInputs.md) |

#### Type declaration

▸ <`Key`, `OptionOptions`, `IsRequired`\>(`key`, `desc`, `options?`): [`OptionBuilder`](modules.md#optionbuilder-1)<`ForceSimplify`<`CurrentOptions` & [`RequiredIf`](modules.md#requiredif)<`IsRequired`, `Record`<`Key`, `OptionOptions` extends [`EnumOption`](modules.md#enumoption)<`unknown`, `unknown`, infer T\> ? `T` extends `string` ? { `enum`: `T`  } : { `type`: typeof `ApplicationCommandOptionType`[`Capitalize`<`MethodName`\>]  } : { `type`: typeof `ApplicationCommandOptionType`[`Capitalize`<`MethodName`\>]  }\>\>\>\>

Given an object of our current options `CurrentOptions` and the method name `MethodName`, resolve
to a method with three type parameters, which all get inferred by its usage.

##### Type parameters

| Name | Type |
| :------ | :------ |
| `Key` | extends `string` |
| `OptionOptions` | extends [`TransformAutocompleteOptions`](modules.md#transformautocompleteoptions)<[`OptionInputs`](interfaces/OptionInputs.md)[`MethodName`], `CurrentOptions`, `Key`\> |
| `IsRequired` | extends `boolean` = ``false`` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Key` |
| `desc` | `string` |
| `options?` | `OptionOptions` & { `required?`: `IsRequired`  } |

##### Returns

[`OptionBuilder`](modules.md#optionbuilder-1)<`ForceSimplify`<`CurrentOptions` & [`RequiredIf`](modules.md#requiredif)<`IsRequired`, `Record`<`Key`, `OptionOptions` extends [`EnumOption`](modules.md#enumoption)<`unknown`, `unknown`, infer T\> ? `T` extends `string` ? { `enum`: `T`  } : { `type`: typeof `ApplicationCommandOptionType`[`Capitalize`<`MethodName`\>]  } : { `type`: typeof `ApplicationCommandOptionType`[`Capitalize`<`MethodName`\>]  }\>\>\>\>

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:146](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L146)

___

### OptionBuilderOrType

Ƭ **OptionBuilderOrType**<`T`\>: [`OptionBuilder`](modules.md#optionbuilder-1)<`T`\> \| `T`

Now here are types for resolving the OptionBuilder's type param to more useful structures.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:204](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L204)

___

### OptionBuilderToDJSResolvedObject

Ƭ **OptionBuilderToDJSResolvedObject**<`X`\>: `X` extends [`OptionBuilderOrType`](modules.md#optionbuilderortype)<infer T\> ? { [K in keyof T]: OptionBuilderEntryToDJSResolved<T[K]\> } : `never`

"DJSResolved" refers to the resolved value given with `$slashCommand`

#### Type parameters

| Name |
| :------ |
| `X` |

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:263](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L263)

___

### OptionBuilderToPurpletResolvedObject

Ƭ **OptionBuilderToPurpletResolvedObject**<`X`\>: `X` extends [`OptionBuilderOrType`](modules.md#optionbuilderortype)<infer T\> ? { [K in keyof T]: OptionBuilderEntryToPurpletResolved<T[K]\> } : `never`

"PurpletResolved" is unused.

#### Type parameters

| Name |
| :------ |
| `X` |

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:243](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L243)

___

### OptionBuilderToUnresolvedObject

Ƭ **OptionBuilderToUnresolvedObject**<`X`\>: `X` extends [`OptionBuilderOrType`](modules.md#optionbuilderortype)<infer T\> ? { [K in keyof T]: OptionBuilderEntryToUnresolved<T[K]\> } : `never`

"Unresolved" refers to the raw `value` property given in an interaction.

#### Type parameters

| Name |
| :------ |
| `X` |

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:223](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L223)

___

### RequiredIf

Ƭ **RequiredIf**<`If`, `T`\>: `If` extends ``false`` ? `Partial`<`T`\> : `T`

If `If` is false, then `T` is returned as a partial, otherwise it is returned as normal.

#### Type parameters

| Name |
| :------ |
| `If` |
| `T` |

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:192](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L192)

___

### TransformAutocompleteOptions

Ƭ **TransformAutocompleteOptions**<`T`, `CurrentOptions`, `Key`\>: `T` extends [`AutocompleteOption`](interfaces/AutocompleteOption.md)<infer ACType\> ? `Overwrite`<`T`, { `autocomplete?`: [`Autocomplete`](modules.md#autocomplete)<`ForceSimplify`<`Partial`<[`OptionBuilderToUnresolvedObject`](modules.md#optionbuildertounresolvedobject)<`CurrentOptions`\> & `Record`<`Key`, `ACType`\>\>\>, `ACType`\>  }\> : `T`

Transforms { autocomplete?: Autocomplete<null, T> } to fill that `null`. This type exists so we
don't have to pass `CurrentOptions` and `Key` through to each thing in `OptionInputs`

#### Type parameters

| Name |
| :------ |
| `T` |
| `CurrentOptions` |
| `Key` |

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:108](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L108)

## Variables

### OptionBuilder

• **OptionBuilder**: `Class`<[`OptionBuilder`](modules.md#optionbuilder-1)<{}\>\>

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:195](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L195)

___

### djs

• **djs**: `Client`

#### Defined in

[packages/purplet/src/lib/global.ts:7](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/global.ts#L7)

___

### rest

• `Const` **rest**: `REST`

Global REST client from `@discordjs/rest`.

#### Defined in

[packages/purplet/src/lib/global.ts:5](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/global.ts#L5)

## Functions

### $applicationCommand

▸ **$applicationCommand**(`opts`): [`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`ApplicationCommandHookData`](interfaces/ApplicationCommandHookData.md) |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Defined in

[packages/purplet/src/hooks/command.ts:21](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command.ts#L21)

___

### $buttonComponent

▸ **$buttonComponent**<`Context`, `CreateProps`\>(`options`): [`MarkedFeature`](modules.md#markedfeature)<`MessageComponentStaticProps`<`Context`, `CreateProps`, `APIButtonComponent`\>\>

#### Type parameters

| Name |
| :------ |
| `Context` |
| `CreateProps` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `ButtonMessageComponentOptions`<`Context`, `CreateProps`\> |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)<`MessageComponentStaticProps`<`Context`, `CreateProps`, `APIButtonComponent`\>\>

#### Defined in

[packages/purplet/src/hooks/component.ts:108](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/component.ts#L108)

___

### $djsOptions

▸ **$djsOptions**(`options`): [`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

This hook allows you to modify the Discord.js configuration. You cannot pass `intents` here, see $intents.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `undefined` \| [`DJSOptions`](modules.md#djsoptions) \| [`EventHook`](modules.md#eventhook)<[`DJSOptions`](modules.md#djsoptions), `void` \| [`DJSOptions`](modules.md#djsoptions)\> |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Defined in

[packages/purplet/src/hooks/basic.ts:39](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/basic.ts#L39)

___

### $intents

▸ **$intents**(...`intents`): [`MarkedFeature`](modules.md#markedfeature)

This hook allows you to specify what gateway intents your gateway bot requires. Does not assume a
Discord.js environment, and will trigger on either using Discord.js, or the `gatewayEvents` hook.

Takes either one or more intents (numbers, see `GatewayIntentBits` from `discord-api-types`), one
or more arrays of intents, or a function returning that.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...intents` | [`IntentResolvable`](modules.md#intentresolvable)[] |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)

#### Defined in

[packages/purplet/src/hooks/gateway.ts:18](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/gateway.ts#L18)

▸ **$intents**(`intents`): [`MarkedFeature`](modules.md#markedfeature)

#### Parameters

| Name | Type |
| :------ | :------ |
| `intents` | `undefined` \| [`DataHook`](modules.md#datahook)<[`IntentResolvable`](modules.md#intentresolvable)\> |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)

#### Defined in

[packages/purplet/src/hooks/gateway.ts:19](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/gateway.ts#L19)

___

### $interaction

▸ **$interaction**(`handler`): [`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `handler` | `undefined` \| [`EventHook`](modules.md#eventhook)<`Interaction`<`CacheType`\>, `void` \| `APIInteractionResponse`\> |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Defined in

[packages/purplet/src/hooks/basic.ts:49](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/basic.ts#L49)

___

### $merge

▸ **$merge**(...`input`): [`FeatureData`](interfaces/FeatureData.md) \| [`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

Merges one or more feature into a single feature object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...input` | (`undefined` \| ``null`` \| ``false`` \| [`FeatureData`](interfaces/FeatureData.md) \| [`MarkedFeature`](modules.md#markedfeature)<`Record`<`never`, `unknown`\>\>)[] |

#### Returns

[`FeatureData`](interfaces/FeatureData.md) \| [`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Defined in

[packages/purplet/src/hooks/merge.ts:5](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/merge.ts#L5)

___

### $messageContextCommand

▸ **$messageContextCommand**(`opts`): [`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`MessageCommandOptions`](interfaces/MessageCommandOptions.md) |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Defined in

[packages/purplet/src/hooks/command-context.ts:38](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command-context.ts#L38)

___

### $modal

▸ **$modal**<`Context`, `CreateProps`\>(`options`): [`MarkedFeature`](modules.md#markedfeature)<`MessageComponentStaticProps`<`Context`, `CreateProps`\>\>

#### Type parameters

| Name |
| :------ |
| `Context` |
| `CreateProps` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `ModalComponentOptions`<`Context`, `CreateProps`\> |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)<`MessageComponentStaticProps`<`Context`, `CreateProps`\>\>

#### Defined in

[packages/purplet/src/hooks/modal.ts:50](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/modal.ts#L50)

___

### $onEvent

▸ **$onEvent**<`E`\>(`eventName`, `handler`): [`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

This hook allows you to listen for a Discord.js client event. Required intents for events are provided.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends keyof `ClientEvents` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `E` |
| `handler` | (...`args`: `ClientEvents`[`E`]) => `void` |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Defined in

[packages/purplet/src/hooks/basic.ts:22](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/basic.ts#L22)

___

### $onRawEvent

▸ **$onRawEvent**<`K`\>(`eventName`, `handler`): [`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`GatewayEventHook`](interfaces/GatewayEventHook.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `K` |
| `handler` | (`data`: [`GatewayEventHook`](interfaces/GatewayEventHook.md)[`K`]) => `void` |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Defined in

[packages/purplet/src/hooks/gateway.ts:27](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/gateway.ts#L27)

___

### $presence

▸ **$presence**(`presence`): [`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

This hook allows you to pass in presence data. It is run only once at startup.

This is a wrapper around `$djsOptions` and passing a `presence` object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `presence` | `PresenceData` |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Defined in

[packages/purplet/src/hooks/gateway.ts:45](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/gateway.ts#L45)

___

### $selectMenuComponent

▸ **$selectMenuComponent**<`Context`, `CreateProps`\>(`options`): [`MarkedFeature`](modules.md#markedfeature)<`MessageComponentStaticProps`<`Context`, `CreateProps`, `APISelectMenuComponent`\>\>

#### Type parameters

| Name |
| :------ |
| `Context` |
| `CreateProps` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `SelectMenuMessageComponentOptions`<`Context`, `CreateProps`\> |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)<`MessageComponentStaticProps`<`Context`, `CreateProps`, `APISelectMenuComponent`\>\>

#### Defined in

[packages/purplet/src/hooks/component.ts:124](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/component.ts#L124)

___

### $service

▸ **$service**(`__namedParameters`): [`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

A service is a way to run some code alongside your bot in a hot-reloadable way. The function
called starts the service, and returns a stopping function. Alternatively, you can pass both a
start and stop function if that is easier.

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`ServiceOptions`](interfaces/ServiceOptions.md) |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Defined in

[packages/purplet/src/hooks/service.ts:14](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/service.ts#L14)

___

### $slashCommand

▸ **$slashCommand**<`T`\>(`options`): [`FeatureData`](interfaces/FeatureData.md) \| [`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ChatCommandData`](interfaces/ChatCommandData.md)<`T`\> |

#### Returns

[`FeatureData`](interfaces/FeatureData.md) \| [`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Defined in

[packages/purplet/src/hooks/command-chat.ts:55](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command-chat.ts#L55)

___

### $userContextCommand

▸ **$userContextCommand**(`opts`): [`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`UserCommandOptions`](interfaces/UserCommandOptions.md) |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)<`Dict`<`unknown`\>\>

#### Defined in

[packages/purplet/src/hooks/command-context.ts:20](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command-context.ts#L20)

___

### createFeature

▸ **createFeature**<`T`\>(`data`, `staticProps?`): [`MarkedFeature`](modules.md#markedfeature)<`T`\>

`createFeature` annotates a FeatureData with a symbol used to mark what object is actually a Feature.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Dict`<`unknown`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`FeatureData`](interfaces/FeatureData.md) |
| `staticProps?` | `T` |

#### Returns

[`MarkedFeature`](modules.md#markedfeature)<`T`\>

#### Defined in

[packages/purplet/src/lib/feature.ts:105](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L105)

___

### createLinkButton

▸ **createLinkButton**(`label`, `url`): `APIButtonComponentWithURL`

#### Parameters

| Name | Type |
| :------ | :------ |
| `label` | `string` |
| `url` | `string` |

#### Returns

`APIButtonComponentWithURL`

#### Defined in

[packages/purplet/src/builders/ComponentBuilder.ts:83](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/ComponentBuilder.ts#L83)

___

### getOptionBuilderAutocompleteHandlers

▸ **getOptionBuilderAutocompleteHandlers**(`builder`): `Record`<`string`, [`Autocomplete`](modules.md#autocomplete)\>

Extract the Record<string, Autocomplete> out of an OptionBuilder.

#### Parameters

| Name | Type |
| :------ | :------ |
| `builder` | `undefined` \| [`OptionBuilder`](modules.md#optionbuilder-1)<{}\> |

#### Returns

`Record`<`string`, [`Autocomplete`](modules.md#autocomplete)\>

#### Defined in

[packages/purplet/src/builders/OptionBuilder.d.ts:198](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/OptionBuilder.d.ts#L198)

___

### isFeature

▸ **isFeature**(`feature`): feature is Feature

Returns true if a value is a `Feature` (this doesn't check annotation state, but it's type
returned will be `Feature` regardless). The subtle cast is in place, since most of the time, the
feature has already been annotated.

#### Parameters

| Name | Type |
| :------ | :------ |
| `feature` | `unknown` |

#### Returns

feature is Feature

#### Defined in

[packages/purplet/src/lib/feature.ts:121](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/lib/feature.ts#L121)
