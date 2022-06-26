import { BasicEncoder, BitArray, GenericSerializer } from '@purplet/serialize';
import type { APIModalInteractionResponseCallbackData } from 'discord-api-types/v10';
import { ModalSubmitInteraction } from 'discord.js';
import { createFeature } from '../lib/feature';
import { JSONResolvable, JSONValue, toJSONValue } from '../utils/plain';
import type { IsUnknown } from '../utils/types';

// TODO: merge shared behavior between message components and modals

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
  toString: (data: JSONValue) => {
    return BasicEncoder.encode(GenericSerializer.serialize(data).asUint8Array());
  },
  fromString: (data: string) => {
    return GenericSerializer.deserialize(BitArray.fromUint8Array(BasicEncoder.decode(data)));
  },
};

interface ModalComponentOptions<Context, CreateProps> {
  structure?: CustomStructure<Context, JSONValue>;
  serializer?: CustomSerializer;
  create(
    ctx: Context,
    createProps: CreateProps
  ): JSONResolvable<APIModalInteractionResponseCallbackData>;
  handle(this: ModalSubmitInteraction, context: Context): void;
}

/** @internal This type is used to remove properties of the `create` function if they are not needed. */
type MessageComponentStaticProps<Context, CreateProps> = IsUnknown<CreateProps> extends true
  ? IsUnknown<Context> extends true
    ? { create(): APIModalInteractionResponseCallbackData }
    : { create(context: Context): APIModalInteractionResponseCallbackData }
  : { create(context: Context, props: CreateProps): APIModalInteractionResponseCallbackData };

export function $modal<Context, CreateProps>(options: ModalComponentOptions<Context, CreateProps>) {
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
        if (i instanceof ModalSubmitInteraction && i.customId.startsWith(featureId + ':')) {
          const data = i.customId.substring(featureId.length + 1);
          const context =
            data.length > 0 ? structure.fromJSON(serializer.fromString(data)) : undefined;
          options.handle.call(i, context);
        }
      },
    },
    // Static Props
    {
      create(context: Context, createProps: CreateProps) {
        const template = toJSONValue(options.create(context, createProps));
        (template as any).custom_id =
          featureId +
          ':' +
          (context !== undefined ? serializer.toString(structure.toJSON(context)) : '');
        return template;
      },
      // This cast makes the two parameters optional if the context is `unknown`.
    } as MessageComponentStaticProps<Context, CreateProps>
  );
}
