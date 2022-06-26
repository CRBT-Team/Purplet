import { BasicEncoder, BitArray, GenericSerializer } from '@purplet/serialize';
import type {
  APIButtonComponent,
  APIMessageActionRowComponent,
  APISelectMenuComponent,
} from 'discord-api-types/v10';
import { createFeature } from '../lib/feature';
import { ButtonInteraction, ComponentInteraction, SelectMenuInteraction } from '../structures';
import { JSONResolvable, JSONValue, toJSONValue } from '../utils/plain';
import type { IsUnknown } from '../utils/types';

type CustomSerializer = {
  toString(data: JSONValue): string;
  fromString(from: string): JSONValue;
};

const defaultSerializer = {
  toString: (data: JSONValue) => {
    return BasicEncoder.encode(GenericSerializer.serialize(data).asUint8Array());
  },
  fromString: (data: string) => {
    return GenericSerializer.deserialize(BitArray.fromUint8Array(BasicEncoder.decode(data)));
  },
};

interface MessageComponentOptions<
  Context,
  CreateProps,
  ComponentType extends APIMessageActionRowComponent
> {
  serializer?: CustomSerializer;
  create(ctx: Context, createProps: CreateProps): JSONResolvable<ComponentType>;
  handle(this: ComponentInteraction, context: Context): void;
}

/** @internal This type is used to remove properties of the `create` function if they are not needed. */
type MessageComponentStaticProps<
  Context,
  CreateProps,
  ComponentType extends APIMessageActionRowComponent
> = IsUnknown<CreateProps> extends true
  ? IsUnknown<Context> extends true
    ? { create(): ComponentType; getCustomId(): string }
    : { create(context: Context): ComponentType; getCustomId(context: Context): string }
  : {
      create(context: Context, props: CreateProps): ComponentType;
      getCustomId(context: Context): string;
    };

function $messageComponent<
  Context,
  CreateProps,
  ComponentType extends APIMessageActionRowComponent
>(options: MessageComponentOptions<Context, CreateProps, ComponentType>) {
  let featureId: string;

  const serializer = options.serializer ?? defaultSerializer;

  return createFeature(
    // Feature Data
    {
      initialize() {
        // Extract the feature ID, as it is passed when the feature is created.
        featureId = this.featureId;
      },
      interaction(i) {
        if (ComponentInteraction.is(i) && i.customId.startsWith(featureId + ':')) {
          const data = i.customId.substring(featureId.length + 1);
          const context = serializer.fromString(data);
          options.handle.call(i, context);
        }
      },
    },
    // Static Props
    {
      create(context: Context, createProps: CreateProps) {
        const template = toJSONValue(options.create(context, createProps));
        (template as any).custom_id =
          featureId + ':' + (context !== undefined ? serializer.toString(context) : '');
        return template;
      },
      getCustomId(context: Context) {
        return featureId + ':' + (context !== undefined ? serializer.toString(context) : '');
      },
      // This cast makes the two parameters optional if the context is `unknown`.
    } as MessageComponentStaticProps<Context, CreateProps, ComponentType>
  );
}

// specific component types. mainly just alter/restrict types.

interface ButtonMessageComponentOptions<Context, CreateProps>
  extends Omit<MessageComponentOptions<Context, CreateProps, APIButtonComponent>, 'handle'> {
  handle(this: ButtonInteraction, context: Context): void;
}

export function $buttonComponent<Context, CreateProps>(
  options: ButtonMessageComponentOptions<Context, CreateProps>
) {
  return $messageComponent({
    ...options,
    handle(this: ButtonInteraction, context: Context) {
      options.handle.call(this, context);
    },
  });
}

interface SelectMenuMessageComponentOptions<Context, CreateProps>
  extends Omit<MessageComponentOptions<Context, CreateProps, APISelectMenuComponent>, 'handle'> {
  handle(this: ComponentInteraction, context: Context & { values: string[] }): void;
}

export function $selectMenuComponent<Context, CreateProps>(
  options: SelectMenuMessageComponentOptions<Context, CreateProps>
) {
  return $messageComponent({
    ...options,
    handle(this: SelectMenuInteraction, context) {
      options.handle.call(this, {
        ...context,
        values: this.values,
      });
    },
  });
}
