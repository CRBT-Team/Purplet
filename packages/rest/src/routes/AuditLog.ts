import '../RouteImports';

/** Routes on https://discord.com/developers/docs/resources/audit-log. */
export const auditLog = group({
  getGuildAuditLog: route({
    method: 'GET',
    route: Routes.guildAuditLog,
    params: ['guildId'] as const,
    result: type<REST.RESTGetAPIAuditLogResult>(),
  }),
});
