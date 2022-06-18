---
id: 'ContextCommandOptions'
title: 'Interface: ContextCommandOptions'
sidebar_label: 'ContextCommandOptions'
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `CommandPermissionsInput`

  ↳ **`ContextCommandOptions`**

  ↳↳ [`UserCommandOptions`](UserCommandOptions.md)

  ↳↳ [`MessageCommandOptions`](MessageCommandOptions.md)

## Properties

### allowInDM

• `Optional` **allowInDM**: `boolean`

#### Inherited from

CommandPermissionsInput.allowInDM

#### Defined in

[packages/purplet/src/utils/permissions.ts:6](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/utils/permissions.ts#L6)

---

### name

• **name**: `string`

#### Defined in

[packages/purplet/src/hooks/command-context.ts:12](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command-context.ts#L12)

---

### nameLocalizations

• `Optional` **nameLocalizations**: `Partial`<`Record`<`"en-US"` \| `"en-GB"` \| `"bg"` \| `"zh-CN"` \| `"zh-TW"` \| `"hr"` \| `"cs"` \| `"da"` \| `"nl"` \| `"fi"` \| `"fr"` \| `"de"` \| `"el"` \| `"hi"` \| `"hu"` \| `"it"` \| `"ja"` \| `"ko"` \| `"lt"` \| `"no"` \| `"pl"` \| `"pt-BR"` \| `"ro"` \| `"ru"` \| `"es-ES"` \| `"sv-SE"` \| `"th"` \| `"tr"` \| `"uk"` \| `"vi"`, `null` \| `string`\>\>

#### Defined in

[packages/purplet/src/hooks/command-context.ts:13](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/hooks/command-context.ts#L13)

---

### permissions

• `Optional` **permissions**: `PermissionResolvable`

#### Inherited from

CommandPermissionsInput.permissions

#### Defined in

[packages/purplet/src/utils/permissions.ts:5](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/utils/permissions.ts#L5)
