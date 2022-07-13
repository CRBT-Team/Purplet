import * as REST from 'discord-api-types/rest';
import { Routes } from 'discord-api-types/rest';
import { group, route, type } from '../route-group';

/** https://discord.com/developers/docs/resources/emoji#list-guild-emojis. */
const listGuildEmojis = route({
  method: 'GET',
  route: Routes.guildEmojis,
  params: ['guildId'],
  result: type<REST.RESTGetAPIGuildEmojisResult>(),
} as const);

/** https://discord.com/developers/docs/resources/emoji#get-guild-emoji. */
const getGuildEmoji = route({
  method: 'GET',
  route: Routes.guildEmoji,
  params: ['guildId', 'emojiId'],
  result: type<REST.RESTGetAPIGuildEmojiResult>(),
} as const);

/** https://discord.com/developers/docs/resources/emoji#create-guild-emoji. */
const createGuildEmoji = route({
  method: 'POST',
  route: Routes.guildEmojis,
  params: ['guildId'],
  body: type<REST.RESTPostAPIGuildEmojiJSONBody>(),
  result: type<REST.RESTPostAPIGuildEmojiResult>(),
  reason: true,
} as const);

/** https://discord.com/developers/docs/resources/emoji#modify-guild-emoji. */
const modifyGuildEmoji = route({
  method: 'PATCH',
  route: Routes.guildEmoji,
  params: ['guildId', 'emojiId'],
  body: type<REST.RESTPatchAPIGuildEmojiJSONBody>(),
  result: type<REST.RESTPatchAPIGuildEmojiResult>(),
  reason: true,
} as const);

/** https://discord.com/developers/docs/resources/emoji#delete-guild-emoji. */
const deleteGuildEmoji = route({
  method: 'DELETE',
  route: Routes.guildEmoji,
  params: ['guildId', 'emojiId'],
  result: type<REST.RESTDeleteAPIGuildEmojiResult>(),
  reason: true,
} as const);

/** Routes on https://discord.com/developers/docs/resources/emoji. */
export const emoji = group({
  listGuildEmojis,
  getGuildEmoji,
  createGuildEmoji,
  modifyGuildEmoji,
  deleteGuildEmoji,
});
