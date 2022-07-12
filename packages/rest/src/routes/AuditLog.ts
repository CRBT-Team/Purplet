import * as REST from 'discord-api-types/rest';
import { Routes } from 'discord-api-types/rest';
import { group, route, type } from '../route-group';

const getGuildAuditLog = route({
  method: 'GET',
  route: Routes.guildAuditLog,
  params: ['guildId'],
  result: type<REST.RESTGetAPIAuditLogResult>(),
} as const);

/** Routes on https://discord.com/developers/docs/resources/audit-log. */
export const auditLog = group({
  /** https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log. */
  getGuildAuditLog,
});
