---
id: 'MessageCommandOptions'
title: 'Interface: MessageCommandOptions'
sidebar_label: 'MessageCommandOptions'
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- [`ContextCommandOptions`](ContextCommandOptions.md)

  ↳ **`MessageCommandOptions`**

## Properties

### allowInDM

• `Optional` **allowInDM**: `boolean`

#### Inherited from

[ContextCommandOptions](ContextCommandOptions.md).[allowInDM](ContextCommandOptions.md#allowindm)

#### Defined in

[packages/purplet/src/utils/permissions.ts:6](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/utils/permissions.ts#L6)

---

### name

• **name**: `string`

#### Inherited from

[ContextCommandOptions](ContextCommandOptions.md).[name](ContextCommandOptions.md#name)

#### Defined in

[packages/purplet/src/hooks/command-context.ts:12](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command-context.ts#L12)

---

### nameLocalizations

• `Optional` **nameLocalizations**: `Partial`<`Record`<`"en-US"` \| `"en-GB"` \| `"bg"` \| `"zh-CN"` \| `"zh-TW"` \| `"hr"` \| `"cs"` \| `"da"` \| `"nl"` \| `"fi"` \| `"fr"` \| `"de"` \| `"el"` \| `"hi"` \| `"hu"` \| `"it"` \| `"ja"` \| `"ko"` \| `"lt"` \| `"no"` \| `"pl"` \| `"pt-BR"` \| `"ro"` \| `"ru"` \| `"es-ES"` \| `"sv-SE"` \| `"th"` \| `"tr"` \| `"uk"` \| `"vi"`, `null` \| `string`\>\>

#### Inherited from

[ContextCommandOptions](ContextCommandOptions.md).[nameLocalizations](ContextCommandOptions.md#namelocalizations)

#### Defined in

[packages/purplet/src/hooks/command-context.ts:13](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command-context.ts#L13)

---

### permissions

• `Optional` **permissions**: `PermissionResolvable`

#### Inherited from

[ContextCommandOptions](ContextCommandOptions.md).[permissions](ContextCommandOptions.md#permissions)

#### Defined in

[packages/purplet/src/utils/permissions.ts:5](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/utils/permissions.ts#L5)

## Methods

### handle

▸ **handle**(`this`, `target`): `void`

#### Parameters

| Name     | Type                                                 |
| :------- | :--------------------------------------------------- |
| `this`   | `MessageContextMenuCommandInteraction`<`CacheType`\> |
| `target` | `APIMessage` \| `Message`<`boolean`\>                |

#### Returns

`void`

#### Defined in

[packages/purplet/src/hooks/command-context.ts:35](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command-context.ts#L35)
