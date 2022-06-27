import { BitSerializer, serializers as S } from '@purplet/serialize';
import {
  APIButtonComponent,
  APIMessageActionRowComponent,
  APISelectMenuComponent,
  ComponentType,
} from 'discord-api-types/v10';
import { createFeature } from '../lib/feature';
import { ButtonInteraction, ComponentInteraction, SelectMenuInteraction } from '../structures';
import { JSONResolvable, toJSONValue } from '../utils/json';
import type { IsUnknown } from '../utils/types';

const purpletCustomIdTrigger = '🟣';

type ComponentResolvable<Component> = JSONResolvable<Omit<Component, 'type' | 'custom_id'>>;

type MessageComponentOptions<
  Context,
  CreateProps,
  ComponentType extends APIMessageActionRowComponent
> = {
  type: ComponentType['type'];
  serializer?: BitSerializer<Context>;
  template:
    | ((ctx: Context, createProps: CreateProps) => ComponentResolvable<ComponentType>)
    | ComponentResolvable<ComponentType>;
  handle(this: ComponentInteraction, context: Context): void;
};

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

  const serializer = options.serializer ?? S.generic;

  function getCustomId(context: Context) {
    const encodedId = S.string.encodeCustomId(featureId);
    if (encodedId.length > 15) {
      throw new Error(`Feature ID is too long: \`${featureId}\``);
    }
    const id = [
      purpletCustomIdTrigger,
      encodedId.length.toString(36),
      encodedId,
      context !== undefined ? serializer.encodeCustomId(context as any) : '',
    ].join('');

    if ([...id].length > 100) {
      throw new Error(
        `Component custom_id is too long. Please reduce the context size of: \`${featureId}\``
      );
    }

    return id;
  }

  return createFeature(
    // Feature Data
    {
      initialize() {
        // Extract the feature ID, as it is passed when the feature is created.
        featureId = this.featureId;
      },
      interaction(i) {
        if (!ComponentInteraction.is(i)) return;
        if (!i.customId.startsWith(purpletCustomIdTrigger)) return;

        const length = parseInt(i.customId.charAt(2), 36);
        const encodedId = S.string.decodeCustomId(i.customId.slice(3, 3 + length));

        console.log({ length, encodedId });

        if (encodedId !== featureId) return;

        const context = serializer.decodeCustomId(i.customId.slice(3 + length)) as Context;
        options.handle.call(i, context);
      },
    },
    // Static Props
    {
      create(context: Context, createProps: CreateProps) {
        const template = toJSONValue(
          typeof options.template === 'function'
            ? options.template(context, createProps)
            : options.template
        );
        return {
          ...template,
          type: options.type,
          custom_id: getCustomId(context),
        };
      },
      getCustomId,
      // This cast makes the two parameters optional if the context is `unknown`.
    } as MessageComponentStaticProps<Context, CreateProps, ComponentType>
  );
}

// specific component types. mainly just alter/restrict types.

interface ButtonMessageComponentOptions<Context, CreateProps>
  extends Omit<
    MessageComponentOptions<Context, CreateProps, APIButtonComponent>,
    'handle' | 'type'
  > {
  handle(this: ButtonInteraction, context: Context): void;
}

export function $buttonComponent<Context, CreateProps>(
  options: ButtonMessageComponentOptions<Context, CreateProps>
) {
  return $messageComponent({
    ...options,
    type: ComponentType.Button,
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
