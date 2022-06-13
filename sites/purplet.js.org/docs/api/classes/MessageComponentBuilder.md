---
id: "MessageComponentBuilder"
title: "Class: MessageComponentBuilder"
sidebar_label: "MessageComponentBuilder"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `ComponentBuilder`<`APIMessageActionRowComponent`\>

  ↳ **`MessageComponentBuilder`**

## Constructors

### constructor

• **new MessageComponentBuilder**()

#### Inherited from

ComponentBuilder<APIMessageActionRowComponent\>.constructor

## Properties

### components

• `Protected` **components**: `APIActionRowComponent`<`APIMessageActionRowComponent`\>[] = `[]`

#### Inherited from

ComponentBuilder.components

#### Defined in

[packages/purplet/src/builders/ComponentBuilder.ts:15](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/ComponentBuilder.ts#L15)

## Methods

### addInline

▸ **addInline**(`item`): [`MessageComponentBuilder`](MessageComponentBuilder.md)

Adds the component inline, but will add a new Action Row if space runs out.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `JSONResolvable`<`APIMessageActionRowComponent`\> |

#### Returns

[`MessageComponentBuilder`](MessageComponentBuilder.md)

#### Inherited from

ComponentBuilder.addInline

#### Defined in

[packages/purplet/src/builders/ComponentBuilder.ts:40](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/ComponentBuilder.ts#L40)

___

### addRow

▸ **addRow**(`row`): [`MessageComponentBuilder`](MessageComponentBuilder.md)

Adds an Action Row, either by providing an array of components, a single component, or a whole
action row.

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | `JSONResolvable`<`APIMessageActionRowComponent` \| `APIActionRowComponent`<`APIMessageActionRowComponent`\> \| `APIMessageActionRowComponent`[]\> |

#### Returns

[`MessageComponentBuilder`](MessageComponentBuilder.md)

#### Inherited from

ComponentBuilder.addRow

#### Defined in

[packages/purplet/src/builders/ComponentBuilder.ts:21](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/ComponentBuilder.ts#L21)

___

### toJSON

▸ **toJSON**(): `APIActionRowComponent`<`APIMessageActionRowComponent`\>[]

#### Returns

`APIActionRowComponent`<`APIMessageActionRowComponent`\>[]

#### Defined in

[packages/purplet/src/builders/ComponentBuilder.ts:60](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/ComponentBuilder.ts#L60)
