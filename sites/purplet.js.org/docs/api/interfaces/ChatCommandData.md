---
id: 'ChatCommandData'
title: 'Interface: ChatCommandData<T>'
sidebar_label: 'ChatCommandData'
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name |
| :--- |
| `T`  |

## Hierarchy

- `CommandPermissionsInput`

  ↳ **`ChatCommandData`**

## Properties

### allowInDM

• `Optional` **allowInDM**: `boolean`

#### Inherited from

CommandPermissionsInput.allowInDM

#### Defined in

[packages/purplet/src/utils/permissions.ts:6](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/utils/permissions.ts#L6)

---

### description

• **description**: `string`

#### Defined in

[packages/purplet/src/hooks/command-chat.ts:23](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command-chat.ts#L23)

---

### descriptionLocalizations

• `Optional` **descriptionLocalizations**: `Partial`<`Record`<`"en-US"` \| `"en-GB"` \| `"bg"` \| `"zh-CN"` \| `"zh-TW"` \| `"hr"` \| `"cs"` \| `"da"` \| `"nl"` \| `"fi"` \| `"fr"` \| `"de"` \| `"el"` \| `"hi"` \| `"hu"` \| `"it"` \| `"ja"` \| `"ko"` \| `"lt"` \| `"no"` \| `"pl"` \| `"pt-BR"` \| `"ro"` \| `"ru"` \| `"es-ES"` \| `"sv-SE"` \| `"th"` \| `"tr"` \| `"uk"` \| `"vi"`, `null` \| `string`\>\>

#### Defined in

[packages/purplet/src/hooks/command-chat.ts:24](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command-chat.ts#L24)

---

### name

• **name**: `string`

#### Defined in

[packages/purplet/src/hooks/command-chat.ts:21](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command-chat.ts#L21)

---

### nameLocalizations

• `Optional` **nameLocalizations**: `Partial`<`Record`<`"en-US"` \| `"en-GB"` \| `"bg"` \| `"zh-CN"` \| `"zh-TW"` \| `"hr"` \| `"cs"` \| `"da"` \| `"nl"` \| `"fi"` \| `"fr"` \| `"de"` \| `"el"` \| `"hi"` \| `"hu"` \| `"it"` \| `"ja"` \| `"ko"` \| `"lt"` \| `"no"` \| `"pl"` \| `"pt-BR"` \| `"ro"` \| `"ru"` \| `"es-ES"` \| `"sv-SE"` \| `"th"` \| `"tr"` \| `"uk"` \| `"vi"`, `null` \| `string`\>\>

#### Defined in

[packages/purplet/src/hooks/command-chat.ts:22](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command-chat.ts#L22)

---

### options

• `Optional` **options**: [`OptionBuilder`](../modules.md#optionbuilder-1)<`T`\>

#### Defined in

[packages/purplet/src/hooks/command-chat.ts:25](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command-chat.ts#L25)

---

### permissions

• `Optional` **permissions**: `PermissionResolvable`

#### Inherited from

CommandPermissionsInput.permissions

#### Defined in

[packages/purplet/src/utils/permissions.ts:5](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/utils/permissions.ts#L5)

## Methods

### handle

▸ **handle**(`this`, `options`): `void`

#### Parameters

| Name | Type |
| :-- | :-- |
| `this` | `ChatInputCommandInteraction`<`CacheType`\> |
| `options` | [`OptionBuilderToDJSResolvedObject`](../modules.md#optionbuildertodjsresolvedobject)<`T`\> |

#### Returns

`void`

#### Defined in

[packages/purplet/src/hooks/command-chat.ts:26](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command-chat.ts#L26)
