import { ButtonBuilder } from '@discordjs/builders';
import {
  APIActionRowComponent,
  APIActionRowComponentTypes,
  APIMessageActionRowComponent,
  APIModalActionRowComponent,
  ButtonStyle,
  ComponentType,
} from 'discord-api-types/v10';

abstract class ComponentBuilder<Type extends APIActionRowComponentTypes> {
  private data: APIActionRowComponent<Type>[] = [];

  toJSON(): APIActionRowComponent<Type>[] {
    return this.data;
  }

  /**
   * Adds an Action Row, either by providing an array of components, a single component, or a whole
   * action row.
   */
  addRow(row: APIActionRowComponent<Type> | Type | Type[]) {
    if (Array.isArray(row)) {
      this.data.push({
        type: ComponentType.ActionRow,
        components: row,
      });
    } else if (row.type === ComponentType.ActionRow) {
      this.data.push(row);
    } else {
      this.data.push({
        type: ComponentType.ActionRow,
        components: [row],
      });
    }
    return this;
  }

  /** Adds the component inline, but will add a new Action Row if space runs out. */
  addInline(item: Type) {
    // SelectMenu and TextInput
    if (
      this.data.length === 0 ||
      item.type === ComponentType.SelectMenu ||
      item.type === ComponentType.TextInput ||
      this.data[this.data.length - 1].components.length >= 5
    ) {
      this.addRow(item);
      return this;
    }

    this.data[this.data.length - 1].components.push(item);

    return this;
  }
}

export class MessageComponentBuilder extends ComponentBuilder<APIMessageActionRowComponent> {}

export class ModalComponentBuilder extends ComponentBuilder<APIModalActionRowComponent> {}

export function createLinkButton(label: string, url: string) {
  return new ButtonBuilder() //
    .setStyle(ButtonStyle.Link)
    .setLabel(label)
    .setURL(url)
    .toJSON();
}
