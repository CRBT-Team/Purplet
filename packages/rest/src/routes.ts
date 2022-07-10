import {
  RESTGetAPIAuditLogResult,
  RESTGetAPICurrentUserResult,
  Routes,
} from 'discord-api-types/v10';
import { group, route, type } from './route-group';

export const auditLog = group({
  getGuildAuditLog: route({
    method: 'GET',
    route: Routes.guildAuditLog,
    params: ['guildId'],
    result: type<RESTGetAPIAuditLogResult>(),
  }),
});

export const autoModeration = group({});

export const channel = group({});

export const emoji = group({});

export const guild = group({});

export const guildScheduledEvent = group({});

export const guildTemplate = group({});

export const invite = group({});

export const stageInstance = group({});

export const sticker = group({});

export const user = group({
  /** https://discord.com/developers/docs/resources/user#get-current-user. */
  getCurrentUser: route({
    method: 'GET',
    route: Routes.user(),
    result: type<RESTGetAPICurrentUserResult>(),
  }),
});

export const voice = group({});

export const webhook = group({});
