import {
  ButtonInteraction,
  Interaction,
  MessageButton,
  MessageComponent,
  MessageComponentInteraction,
  MessageSelectMenu,
  Modal,
  ModalSubmitInteraction,
  SelectMenuInteraction,
} from 'discord.js';
import { createInstance, HandlerInstance } from '..';
import { Handler } from '../Handler';
import { BasicEncoder, BitArray, GenericSerializer, GenericValue } from '../serialize';

type Context = any;

export interface ComponentDataInput<
  I extends MessageComponentInteraction | ModalSubmitInteraction =
    | MessageComponentInteraction
    | ModalSubmitInteraction,
  T extends Context = Context
> {
  handle(this: I, ctx: T): void;
}

export interface ComponentDataInputNoContext<
  I extends MessageComponentInteraction | ModalSubmitInteraction =
    | MessageComponentInteraction
    | ModalSubmitInteraction
> {
  handle(this: I): void;
}

export interface ComponentData<
  I extends MessageComponentInteraction | ModalSubmitInteraction =
    | MessageComponentInteraction
    | ModalSubmitInteraction,
  T extends Context = Context
> extends ComponentDataInput<I, T> {
  baseId: string;
}

export interface ComponentInstance<
  I extends MessageComponentInteraction | ModalSubmitInteraction,
  T extends Context
> extends HandlerInstance<ComponentData<I, T>> {
  generateId(data: T): string;
}

export type ComponentInstanceTemplate<
  I extends MessageComponentInteraction | ModalSubmitInteraction,
  C extends MessageComponent | Modal,
  T extends Context
> = ComponentInstance<I, T> & (T extends undefined ? { new (): C } : { new (ctx: T): C });

export type ButtonComponentInstance<T extends Context> = ComponentInstanceTemplate<
  ButtonInteraction,
  MessageButton,
  T
>;

export type SelectMenuComponentInstance<T extends Context> = ComponentInstanceTemplate<
  SelectMenuInteraction,
  MessageSelectMenu,
  T
>;

export type ModalComponentInstance<T extends Context> = ComponentInstanceTemplate<
  ModalSubmitInteraction,
  Modal,
  T
>;

export class ComponentHandler extends Handler<ComponentData> {
  components = new Map<string, ComponentData>();

  handleInteraction = (interaction: Interaction) => {
    if (!interaction.isMessageComponent() && !interaction.isModalSubmit()) return;

    const array = GenericSerializer.deserialize(
      BitArray.fromUint8Array(BasicEncoder.decode(interaction.customId))
    ) as [string, Context];

    const [id, data] = array;

    const component = this.components.get(id);
    if (!component) return;

    component.handle.call(interaction, data);
  };

  init() {
    this.client.on('interactionCreate', this.handleInteraction);
  }

  cleanup() {
    this.client.off('interactionCreate', this.handleInteraction);
  }

  register(id: string, instance: ComponentData) {
    this.components.set(id, instance);
    instance.baseId = id;
  }

  unregister(id: string) {
    this.components.delete(id);
  }
}

function GenerateId<T extends Context>(
  this: ComponentInstance<MessageComponentInteraction | ModalSubmitInteraction, T>,
  data: T
) {
  const array = GenericSerializer.serialize([
    this.data.baseId,
    data as GenericValue,
  ]).asUint8Array();
  const encoded = BasicEncoder.encode(array);
  if (encoded.length > 100) {
    throw new Error(
      `Cannot fit data into a discord custom_id: bytes=${array.length}, chars=${encoded.length}`
    );
  }
  return encoded;
}

export function BaseComponent<
  I extends MessageComponentInteraction | ModalSubmitInteraction,
  T extends Context
>(data: ComponentDataInput<I, T>) {
  const instance = createInstance(ComponentHandler, {
    baseId: 'unknown',
    handle: data.handle,
  }) as ComponentInstance<I, T>;

  instance.generateId = GenerateId;

  return instance;
}

export function ButtonComponent<T extends Context>(
  data: ComponentDataInputNoContext<ButtonInteraction>
): ButtonComponentInstance<undefined>;
export function ButtonComponent<T extends Context>(
  data: ComponentDataInput<ButtonInteraction, T>
): ButtonComponentInstance<T>;
export function ButtonComponent<T extends Context>(data: ComponentDataInput) {
  const instance = BaseComponent<ButtonInteraction, T>(data);

  return new Proxy(
    Object.assign(function () {}, instance),
    {
      construct(target, [data]) {
        const button = new MessageButton().setCustomId(instance.generateId(data));
        return button;
      },
    }
  ) as unknown;
}

export function SelectMenuComponent<T extends Context>(
  data: ComponentDataInputNoContext<SelectMenuInteraction>
): ComponentInstance<SelectMenuInteraction, T>;
export function SelectMenuComponent<T extends Context>(
  data: ComponentDataInput<SelectMenuInteraction, T>
): ComponentInstance<SelectMenuInteraction, T>;
export function SelectMenuComponent<T extends Context>(data: ComponentDataInput) {
  const instance = BaseComponent<SelectMenuInteraction, T>(data);

  return new Proxy(
    Object.assign(function () {}, instance),
    {
      construct(target, [data]) {
        const selectMenu = new MessageSelectMenu().setCustomId(instance.generateId(data));
        return selectMenu;
      },
    }
  ) as unknown;
}

export function ModalComponent<T extends Context>(
  data: ComponentDataInputNoContext<ModalSubmitInteraction>
): ModalComponentInstance<T>;
export function ModalComponent<T extends Context>(
  data: ComponentDataInput<ModalSubmitInteraction, T>
): ModalComponentInstance<T>;
export function ModalComponent<T extends Context>(data: ComponentDataInput) {
  const instance = BaseComponent<ModalSubmitInteraction, T>(data);

  return new Proxy(
    Object.assign(function () {}, instance),
    {
      construct(target, [data]) {
        const modal = new Modal().setCustomId(instance.generateId(data));
        return modal;
      },
    }
  ) as unknown;
}
