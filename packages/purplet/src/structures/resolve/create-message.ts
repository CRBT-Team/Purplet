import type { RawFile } from '@discordjs/rest';
import { APIEmbed, MessageFlags, RESTPostAPIChannelMessageJSONBody } from 'purplet/types';
import { CamelCasedValue, uncamelCase } from '../../utils/camel-case';
import { JSONResolvable, toJSONValue } from '../../utils/json';

export type FileData = string | Buffer | Uint8Array | ArrayBufferLike;

function toBuffer(x: FileData): Buffer {
  if (x instanceof Buffer) return x;
  return Buffer.from(x as Uint8Array);
}

export type CreateMessageData =
  | string
  | JSONResolvable<
      | CreateMessageObject
      | APIEmbed
      | APIEmbed[]
      | CreateMessageAttachment
      | CreateMessageAttachment[]
    >;

export type CreateInteractionMessageData = CreateMessageData & { ephemeral?: boolean };

export interface CreateMessageObject
  extends Omit<CamelCasedValue<RESTPostAPIChannelMessageJSONBody>, 'attachments'> {
  attachments?: CreateMessageAttachment[];
}

export interface CreateMessageAttachment {
  filename: string;
  description?: string;
  data: FileData;
}

const embedFields = [
  'title',
  'type',
  'description',
  'url',
  'timestamp',
  'color',
  'footer',
  'image',
  'thumbnail',
  'video',
  'provider',
  'author',
  'fields',
];

interface APIAttachmentPartial {
  id: string;
  filename: string;
  description?: string;
}

function transformAttachment(
  attachment: CreateMessageAttachment,
  i: number
): {
  attachment: APIAttachmentPartial;
  file: RawFile;
} {
  return {
    attachment: {
      id: i.toString(),
      filename: attachment.filename,
      description: attachment.description,
    },
    file: {
      name: attachment.filename,
      data: toBuffer(attachment.data),
    },
  };
}

export interface CreateMessageResult {
  message: RESTPostAPIChannelMessageJSONBody;
  files: RawFile[];
}

export function resolveCreateMessageData(input: CreateMessageData): CreateMessageResult {
  const data = toJSONValue(input as JSONResolvable<CreateMessageObject>);

  // String
  if (typeof data === 'string') {
    return {
      message: { content: data },
      files: [],
    };
  }

  // Array
  if (Array.isArray(data)) {
    const isEmbed = embedFields.includes(Object.keys(data[0])[0]);
    if (isEmbed) {
      return { message: { embeds: data as APIEmbed[] }, files: [] };
    } else {
      const attachments = (data as CreateMessageAttachment[]).map(transformAttachment);
      return {
        message: { attachments: attachments.map(x => x.attachment) },
        files: attachments.map(x => x.file),
      };
    }
  }

  const isEmbed = embedFields.includes(Object.keys(data)[0]);
  if (isEmbed) {
    return { message: { embeds: [data as APIEmbed] }, files: [] };
  }

  if ('filename' in data) {
    const attachment = transformAttachment(data as CreateMessageAttachment, 0);
    return {
      message: { attachments: [attachment.attachment] },
      files: [attachment.file],
    };
  }

  const uncamel = uncamelCase(data as CreateMessageData) as RESTPostAPIChannelMessageJSONBody;

  const attachments = uncamel.attachments
    ? (uncamel.attachments as unknown as CreateMessageAttachment[]).map(transformAttachment)
    : [];

  return {
    message: {
      ...uncamel,
      attachments: attachments.map(x => x.attachment),
    },
    files: attachments.map(x => x.file),
  };
}

export function resolveCreateInteractionMessageData(
  input: CreateInteractionMessageData
): CreateMessageResult {
  const resolved = resolveCreateMessageData(input);
  if (typeof input === 'object' && input && 'ephemeral' in input) {
    if (input.ephemeral) {
      resolved.message.flags = (resolved.message.flags ?? 0) | MessageFlags.Ephemeral;
    }
    delete input.ephemeral;
  }
  return resolved;
}
