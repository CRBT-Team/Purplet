---
id: 'ModalComponentBuilder'
title: 'Class: ModalComponentBuilder'
sidebar_label: 'ModalComponentBuilder'
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `ComponentBuilder`<`APIModalActionRowComponent`\>

  ↳ **`ModalComponentBuilder`**

## Constructors

### constructor

• **new ModalComponentBuilder**()

#### Inherited from

ComponentBuilder<APIModalActionRowComponent\>.constructor

## Properties

### #modalTitle

• `Private` **#modalTitle**: `string` = `'Modal'`

#### Defined in

[packages/purplet/src/builders/ComponentBuilder.ts:66](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/ComponentBuilder.ts#L66)

---

### components

• `Protected` **components**: `APIActionRowComponent`<`APITextInputComponent`\>[] = `[]`

#### Inherited from

ComponentBuilder.components

#### Defined in

[packages/purplet/src/builders/ComponentBuilder.ts:15](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/ComponentBuilder.ts#L15)

## Methods

### addInline

▸ **addInline**(`item`): [`ModalComponentBuilder`](ModalComponentBuilder.md)

Adds the component inline, but will add a new Action Row if space runs out.

#### Parameters

| Name   | Type                                       |
| :----- | :----------------------------------------- |
| `item` | `JSONResolvable`<`APITextInputComponent`\> |

#### Returns

[`ModalComponentBuilder`](ModalComponentBuilder.md)

#### Inherited from

ComponentBuilder.addInline

#### Defined in

[packages/purplet/src/builders/ComponentBuilder.ts:40](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/ComponentBuilder.ts#L40)

---

### addRow

▸ **addRow**(`row`): [`ModalComponentBuilder`](ModalComponentBuilder.md)

Adds an Action Row, either by providing an array of components, a single component, or a whole action row.

#### Parameters

| Name | Type |
| :-- | :-- |
| `row` | `JSONResolvable`<`APITextInputComponent` \| `APIActionRowComponent`<`APITextInputComponent`\> \| `APITextInputComponent`[]\> |

#### Returns

[`ModalComponentBuilder`](ModalComponentBuilder.md)

#### Inherited from

ComponentBuilder.addRow

#### Defined in

[packages/purplet/src/builders/ComponentBuilder.ts:21](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/ComponentBuilder.ts#L21)

---

### setTitle

▸ **setTitle**(`title`): [`ModalComponentBuilder`](ModalComponentBuilder.md)

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `title` | `string` |

#### Returns

[`ModalComponentBuilder`](ModalComponentBuilder.md)

#### Defined in

[packages/purplet/src/builders/ComponentBuilder.ts:68](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/ComponentBuilder.ts#L68)

---

### toJSON

▸ **toJSON**(): `APIModalInteractionResponseCallbackData`

#### Returns

`APIModalInteractionResponseCallbackData`

#### Defined in

[packages/purplet/src/builders/ComponentBuilder.ts:73](https://github.com/CRBT-Team/Purplet/blob/b72b1ee/packages/purplet/src/builders/ComponentBuilder.ts#L73)
