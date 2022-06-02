import type {
  APIButtonComponent,
  APIMessageActionRowComponent,
  APISelectMenuComponent,
} from 'discord.js';
import { createFeature } from '../lib/feature';
import {
  PurpletButtonInteraction,
  PurpletComponentInteraction,
  PurpletSelectMenuInteraction,
} from '../structures';
import { JSONResolvable, JSONValue, toJSONValue } from '../utils/plain';
import type { IsUnknown } from '../utils/types';

type CustomStructure<Deserialized, Serialized> = {
  toJSON(data: Deserialized): Serialized;
  fromJSON(from: Serialized): Deserialized;
};
type CustomSerializer = {
  toString(data: JSONValue): string;
  fromString(from: string): JSONValue;
};

const defaultStructure: CustomStructure<any, any> = {
  toJSON: toJSONValue,
  fromJSON: (from: any) => from,
};

const defaultSerializer = {
  toString: (data: JSONValue) => JSON.stringify(data),
  fromString: (data: string) => JSON.parse(data),
};

interface MessageComponentOptions<
  Context,
  CreateProps,
  ComponentType extends APIMessageActionRowComponent
> {
  structure?: CustomStructure<Context, JSONValue>;
  serializer?: CustomSerializer;
  create(ctx: Context, createProps: CreateProps): JSONResolvable<ComponentType>;
  handle(this: PurpletComponentInteraction, context: Context): void;
}

/** @internal This type is used to remove properties of the `create` function if they are not needed. */
type MessageComponentStaticProps<
  Context,
  CreateProps,
  ComponentType extends APIMessageActionRowComponent
> = IsUnknown<CreateProps> extends true
  ? IsUnknown<Context> extends true
    ? { create(): ComponentType }
    : { create(context: Context): ComponentType }
  : { create(context: Context, props: CreateProps): ComponentType };

function $messageComponent<
  Context,
  CreateProps,
  ComponentType extends APIMessageActionRowComponent
>(options: MessageComponentOptions<Context, CreateProps, ComponentType>) {
  let featureId: string;

  const serializer = options.serializer ?? defaultSerializer;
  const structure = options.structure ?? defaultStructure;

  return createFeature(
    // Feature Data
    {
      name: 'component',
      initialize() {
        featureId = this.featureId;
      },
      interaction(i) {
        if (i instanceof PurpletComponentInteraction && i.customId.startsWith(featureId + ':')) {
          const data = i.customId.substring(featureId.length + 1);
          const context = structure.fromJSON(serializer.fromString(data));
          options.handle.call(i, context);
        }
      },
    },
    // Static Props
    {
      create(context: Context, createProps: CreateProps) {
        const template = toJSONValue(options.create(context, createProps));
        (template as any).custom_id =
          featureId + ':' + serializer.toString(structure.toJSON(context));
        return template;
      },
      // This cast makes the two parameters optional if the context is `unknown`.
    } as MessageComponentStaticProps<Context, CreateProps, ComponentType>
  );
}

// specific component types. mainly just alter/restrict types.

interface ButtonMessageComponentOptions<Context, CreateProps>
  extends Omit<MessageComponentOptions<Context, CreateProps, APIButtonComponent>, 'handle'> {
  handle(this: PurpletButtonInteraction, context: Context): void;
}

export function $buttonComponent<Context, CreateProps>(
  options: ButtonMessageComponentOptions<Context, CreateProps>
) {
  return $messageComponent({
    ...options,
    handle(this: PurpletButtonInteraction, context: Context) {
      options.handle.call(this, context);
    },
  });
}

interface SelectMenuMessageComponentOptions<Context, CreateProps>
  extends Omit<MessageComponentOptions<Context, CreateProps, APISelectMenuComponent>, 'handle'> {
  handle(this: PurpletComponentInteraction, context: Context & { values: string[] }): void;
}

export function $selectMenuComponent<Context, CreateProps>(
  options: SelectMenuMessageComponentOptions<Context, CreateProps>
) {
  return $messageComponent({
    ...options,
    handle(this: PurpletSelectMenuInteraction, context) {
      options.handle.call(this, {
        ...context,
        values: this.values,
      });
    },
  });
}
