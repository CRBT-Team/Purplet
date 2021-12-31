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
} from 'discord.js';

export type ComponentResolvable = MessageComponent | MessageComponentOptions;

export function row(...components: MessageActionRowComponentResolvable[]) {
  return new MessageActionRow().addComponents(components);
}

export function components(...components: ComponentResolvable[]) {
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
