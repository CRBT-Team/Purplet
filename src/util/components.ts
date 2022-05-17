import {
  MessageActionRow,
  MessageActionRowComponentResolvable,
  MessageActionRowOptions,
  MessageButton,
  MessageButtonOptions,
  MessageComponent,
  MessageComponentOptions,
  MessageSelectMenu,
  MessageSelectMenuOptions,
  ModalActionRowComponentResolvable,
} from 'discord.js';

export type ComponentResolvable = MessageComponent | MessageComponentOptions;

export function row(
  ...components: (MessageActionRowComponentResolvable | ModalActionRowComponentResolvable | null)[]
): MessageActionRow<any> {
  return new MessageActionRow().addComponents(
    components.filter(Boolean) as MessageActionRowComponentResolvable[]
  );
}

export function components(...components: ComponentResolvable[]): any[] {
  return components.map((x) => {
    if (x.type === 'ACTION_ROW') {
      return new MessageActionRow(x as MessageActionRowOptions);
    } else if (x.type === 'BUTTON') {
      return row(new MessageButton(x as MessageButtonOptions));
    } else if (x.type === 'SELECT_MENU') {
      return row(new MessageSelectMenu(x as MessageSelectMenuOptions));
    } else {
      throw new Error(`Unknown component type: ${x.type}`);
    }
  });
}
