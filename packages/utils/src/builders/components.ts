import type {
  APIActionRowComponent,
  APIActionRowComponentTypes,
  APIButtonComponentWithURL,
  APIMessageActionRowComponent,
  APIModalActionRowComponent,
  APIModalInteractionResponseCallbackData,
} from 'discord-api-types/payloads';
import { ButtonStyle, ComponentType } from 'discord-api-types/payloads';
import { JSONResolvable, toJSONValue } from '../json';

abstract class ComponentBuilder<Type extends APIActionRowComponentTypes> {
  protected components: Array<APIActionRowComponent<Type>> = [];

  /**
   * Adds an Action Row, either by providing an array of components, a single component, or a whole
   * action row.
   */
  addRow(row: JSONResolvable<APIActionRowComponent<Type> | Type | Type[]> = []) {
    const resolved = toJSONValue(row);
    if (Array.isArray(resolved)) {
      this.components.push({
        type: ComponentType.ActionRow,
        components: resolved,
      });
    } else if (resolved.type === ComponentType.ActionRow) {
      this.components.push(resolved);
    } else {
      this.components.push({
        type: ComponentType.ActionRow,
        components: [resolved],
      });
    }
    return this;
  }

  /** Adds the component inline, but will add a new Action Row if space runs out. */
  addInline(item: JSONResolvable<Type>) {
    const resolved = toJSONValue(item);
    // SelectMenu and TextInput
    if (
      this.components.length === 0 ||
      resolved.type === ComponentType.SelectMenu ||
      resolved.type === ComponentType.TextInput ||
      this.components[this.components.length - 1].components.length >= 5
    ) {
      this.addRow(item);
      return this;
    }

    this.components[this.components.length - 1].components.push(resolved);

    return this;
  }
}

export class MessageComponentBuilder extends ComponentBuilder<APIMessageActionRowComponent> {
  toJSON() {
    return this.components.filter(c => c.components.length > 0);
  }
}

export class ModalComponentBuilder extends ComponentBuilder<APIModalActionRowComponent> {
  #modalTitle = 'Modal';

  setTitle(title: string) {
    this.#modalTitle = title;
    return this;
  }

  toJSON(): APIModalInteractionResponseCallbackData {
    return {
      // This builder doesnt have the custom id field because Purplet internals change this anyways
      custom_id: 'custom_id',
      title: this.#modalTitle,
      components: this.components,
    };
  }
}

export function createLinkButton(label: string, url: string): APIButtonComponentWithURL {
  return {
    type: ComponentType.Button,
    style: ButtonStyle.Link,
    label,
    url,
  };
}
