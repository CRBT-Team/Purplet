#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { capitalize } from '@davecode/utils';

if (!existsSync('discord-api-docs')) {
  execSync('git clone https://github.com/discord/discord-api-docs');
} else {
  process.chdir('discord-api-docs');
  execSync('git pull');
  process.chdir('../');
}

const routeMap = {
  ApplicationCommand: 'discord-api-docs/docs/interactions/Application_Commands.md',
  AuditLog: 'discord-api-docs/docs/resources/Audit_Log.md',
  AutoModeration: 'discord-api-docs/docs/resources/Auto_Moderation.md',
  Channel: 'discord-api-docs/docs/resources/Channel.md',
  Emoji: 'discord-api-docs/docs/resources/Emoji.md',
  Gateway: 'discord-api-docs/docs/topics/Gateway.md',
  Guild: 'discord-api-docs/docs/resources/Guild.md',
  GuildScheduledEvent: 'discord-api-docs/docs/resources/Guild_Scheduled_Event.md',
  GuildTemplate: 'discord-api-docs/docs/resources/Guild_Template.md',
  InteractionResponse: 'discord-api-docs/docs/interactions/Receiving_and_Responding.md',
  Invite: 'discord-api-docs/docs/resources/Invite.md',
  Oauth2: 'discord-api-docs/docs/topics/OAuth2.md',
  StageInstance: 'discord-api-docs/docs/resources/Stage_Instance.md',
  Sticker: 'discord-api-docs/docs/resources/Sticker.md',
  User: 'discord-api-docs/docs/resources/User.md',
  Voice: 'discord-api-docs/docs/resources/Voice.md',
  Webhook: 'discord-api-docs/docs/resources/Webhook.md',
};

const overrides = {
  noBody: [
    //
    'crosspostMessage',
    'createReaction',
    'triggerTypingIndicator',
    'pinMessage',
    'joinThread',
    'addThreadMember',
    'addGuildMemberRole',
    'syncGuildTemplate',
    'createGuildSticker',
  ],
  typeBase: {
    createMessage: 'Discord.RESTPostAPIChannelMessage',
    deleteAllReactions: 'Discord.RESTDeleteAPIChannelAllMessageReactions',
    getReactions: 'Discord.RESTGetAPIChannelMessageReactionUsers',
    createChannelInvite: 'Discord.RESTPostAPIChannelInvite',
    startThreadFromMessage: 'Discord.RESTPostAPIChannelMessagesThreads',
    modifyCurrentUserNick: 'Discord.RESTPatchAPICurrentGuildMemberNickname',
    createGuildEmoji: 'Discord.RESTPostAPIGuildEmoji',
    createGuildChannel: 'Discord.RESTPostAPIGuildChannel',
    modifyGuildChannelPositions: 'Discord.RESTPatchAPIGuildChannelPositions',
    listActiveGuildThreads: 'Discord.RESTGetAPIGuildThreads',
    getGuildRoles: 'Discord.RESTGetAPIGuildRoles',
    modifyGuildMFALevel: 'Discord.RESTPostAPIGuildsMFA',
    getGuildPruneCount: 'Discord.RESTGetAPIGuildPruneCount',
    getGuildVoiceRegions: 'Discord.RESTGetAPIGuildVoiceRegions',
    getGuildWidgetSettings: 'Discord.RESTGetAPIGuildWidgetSettings',
    modifyGuildWidget: 'Discord.RESTPatchAPIGuildWidgetSettings',
    modifyCurrentUserVoiceState: 'Discord.RESTPatchAPIGuildVoiceStateCurrentMember',
    listNitroStickerPacks: 'Discord.RESTGetNitroStickerPacks',
    createGuildScheduledEvent: 'Discord.RESTPostAPIGuildScheduledEvent',
    createGuildFromGuildTemplate: 'Discord.RESTPostAPITemplateCreateGuild',
    syncGuildTemplate: 'Discord.RESTPutAPIGuildTemplateSync',
    getCurrentBotApplicationInformation: 'Discord.RESTGetAPIOAuth2CurrentApplication',
    getCurrentAuthorizationInformation: 'Discord.RESTGetAPIOAuth2CurrentAuthorization',
    createStageInstance: 'Discord.RESTPostAPIStageInstance',
    createGuildSticker: 'Discord.RESTPostAPIGuildSticker',
    getCurrentUserGuildMember: 'Discord.RESTGetCurrentUserGuildMember',
    createDM: 'Discord.RESTPostAPICurrentUserCreateDMChannel',
    createGroupDM: 'Discord.RESTPostAPICurrentUserCreateDMChannel',
    listVoiceRegions: 'Discord.RESTGetAPIGuildVoiceRegions',
    createWebhook: 'Discord.RESTPostAPIChannelWebhook',
    listJoinedPrivateArchivedThreads: 'Discord.RESTGetAPIChannelUsersThreadsArchived',
  },
  body: {
    createGroupDM: '{ access_tokens: string[]; nicks: Record<string, string> }',
    executeSlackCompatibleWebhook: 'any',
    executeGitHubCompatibleWebhook: 'any',
  },
  query: {
    getGlobalApplicationCommands: '{ with_localizations?: boolean }',
    getGuildApplicationCommands: '{ with_localizations?: boolean }',
    getWebhookMessage: '{ thread_id?: boolean }',
    editWebhookMessage: '{ thread_id?: boolean }',
    deleteWebhookMessage: '{ thread_id?: boolean }',
    listJoinedPrivateArchivedThreads: '{ limit?: number; before?: string; }',
  },
  result: {
    modifyCurrentMember: 'Discord.RESTGetAPIGuildMemberResult',
    modifyUserVoiceState: 'never',
  },
  form: {
    createGuildSticker:
      "Omit<Discord.RESTPostAPIGuildStickerFormDataBody, 'file'> & { file: FileData }",
  },
  deprecated: {
    createGroupDM: 'DMs created with this endpoint will not be shown in the Discord client',
  },
  noAuth: ['getGateway'],
};

const docBaseURL = 'https://discordapp.com/developers/docs';

function fileToDocURL(file) {
  file = file.replace(/^discord-api-docs\//, '');
  file = file.replace(/^docs\//, '');
  file = file.replace(/^\//, '');

  return `${docBaseURL}/${file.replace('.md', '').replaceAll('_', '-').toLowerCase()}`;
}

/** `#DOCS_CATEGORY_PAGE_NAME` -> proper url. */
function slugToDocsURL(slug) {
  const [, category, ...pageName] = slug.replace(/^\//, '').toLowerCase().split('_');
  return `${docBaseURL}/${category}/${pageName.join('-').replace('/', '#')}`;
}

// ## Endpoint name % METHOD /path/to/file
const regexEndpointHeader = /^## (.+) % (\w+) (\/.+)$/;

// We should split this function up. I opened a GitHub issue for this particular func:
// https://github.com/CRBT-Team/Purplet/issues/65
// eslint-disable-next-line complexity
function transformContents({ contents, exportName, filename }) {
  const lines = contents.split('\n').concat('## EOF');

  let currentEndpoint = null;
  let tempMatch = null;
  let i = 0;
  const tsSource = [];
  const jsSource = [];
  let mdContent = '';

  for (; i < lines.length; i++) {
    const line = lines[i];
    if ((tempMatch = line.match(regexEndpointHeader)) || line.startsWith('## ')) {
      if (currentEndpoint) {
        const camelCasedName = (
          currentEndpoint[1][0].toLowerCase() +
          currentEndpoint[1].slice(1).replace(/\s+(\w)/g, (match, p1) => p1.toUpperCase())
        )
          .replace('/', 'Or')
          .replace(/[^a-zA-Z0-9]/g, '');

        const params = [];
        const method = currentEndpoint[2];
        let endpoint = currentEndpoint[3];
        let matched;
        while ((matched = /{([a-zA-Z_.]*?)#.*?}/g.exec(endpoint))) {
          const paramName = matched[1]
            .replace(/_[a-zA-Z]/g, x => x[1].toUpperCase())
            .replace(/\.[a-zA-Z]/g, match => match[1].toUpperCase());
          params.push(paramName);
          endpoint = endpoint.replace(matched[0], `\${${paramName}}`);
        }

        const deprecationNote =
          /> danger\n> (Deprecated.*)/.exec(mdContent) ??
          (overrides.deprecated[camelCasedName]
            ? [null, overrides.deprecated[camelCasedName]]
            : null);

        const jsdocMdContent = (
          (deprecationNote ? `@deprecated **${deprecationNote[1]}**\n\n` : '') +
          `## [${currentEndpoint[1]}](${fileToDocURL(filename)}#${currentEndpoint[1]
            .replaceAll(/[^a-zA-Z ]/g, '')
            .replaceAll(' ', '-')
            .toLowerCase()})\n\n` +
          mdContent //
            .replace(/\n.*following format(?:.|\n)*/, '')
            .replace(/\n##* (?:.|\n)*/, '')
        )
          .replace(/^######/gm, '###')
          .replace(/> danger\n> (Deprecated.*)/gm, '')
          .replace(/> .*\n> (.*)/gm, (_, text) => (text.includes('X-Audit-Log-Reason') ? '' : text))
          .replace(/#DOCS_[a-zA-Z/_-]+/, str => slugToDocsURL(str))
          .replace(/\n\n+/g, '\n\n')
          .trim();

        // discord-api-types' rest types hard loosely based on the requesting url, so we
        // do that but implement every single edge case.

        // TODO: scan the discord-api-types package for types with matching jsdocs, and use those
        // I didn't consider that route until this was already mostly written, but that'd make it
        // more future proof, less effort, etc.
        const tsTypeNameBase =
          overrides.typeBase[camelCasedName] ??
          `Discord.REST${capitalize(method.toLowerCase())}API` +
            endpoint
              .slice(1)
              .split('/')
              .map(x => x.replace(/\${(.*)}/, (_, y) => `:${y.replace(/Id$/, '')}`))
              .join('/')
              .replace(
                'webhooks/:applicationId/:interactionToken/messages/@original',
                'interaction-original-response'
              )
              .replace(
                'webhooks/:applicationId/:interactionToken/messages/:messageId',
                'interaction-follow-up-response'
              )
              .replace('webhooks/:application/:interactionToken', 'InteractionFollowup')
              // .replace(':interaction/:interactionToken', ':interaction')
              .replace('users/@me', 'current-user')
              .replace('mfa', 'MFA')
              .replace('guilds/:guild/members/@me', 'current-guild-member')
              .replace('voice-states/:user', 'voice-state-user')
              .replace('voice-states/@me', 'voice-state-current-user')
              .replace('guilds/templates', 'templates')
              .replace('guilds/:guild/roles', 'guild-role')
              .replace('guilds/:guild/roles', 'guild-role')
              .replace(
                'applications/:application/guilds/:guild/commands/permissions',
                'guild-application-commands-permissions'
              )
              .replace(
                'applications/:application/guilds/:guild/commands/:command/permissions',
                'application-command-permissions'
              )
              .replace('github', 'GitHub')
              .replace('Followup/messages', 'Followup')
              .replace('thread-members/:user', 'thread-members')
              .replace('guilds/:guild/audit-logs', 'audit-log')
              .replace(':webhookToken', 'WithToken')
              .replace(/([a-z]+)s\/:.*?(\/|$)/g, '$1$2')
              .replace(/-[a-z]/g, x => x[1].toUpperCase())
              .replace('.png', 'Image')
              .replace('.json', 'JSON')
              .split('/')
              .filter(x => !x.startsWith(':') && !x.startsWith('@'))
              .map(capitalize)
              .join('');

        const routeValueJS =
          params.length === 0
            ? `"${endpoint}"`
            : `(${params.map(x => `${x}`).join(', ')}) => \`${endpoint}\``;

        const paramValueJS =
          params.length === 0 ? '' : `params: [${params.map(param => `"${param}"`).join(', ')}],`;
        const fileValueJS =
          mdContent.includes('#DOCS_REFERENCE/uploading-files') ||
          mdContent.includes('#DOCS_RESOURCES_WEBHOOK/edit-webhook-message')
            ? `file: true,`
            : '';

        const noAuth = overrides.noAuth.includes(camelCasedName) ? 'auth: false,' : '';

        const reasonValueJS = mdContent.includes('X-Audit-Log-Reason') ? `reason: true,` : '';

        const queryValueJS = mdContent.includes('###### Query String Params')
          ? `query: ${overrides.query[camelCasedName] ?? `${tsTypeNameBase}Query`},`
          : '';

        const bodyValueJS =
          ['POST', 'PUT', 'PATCH'].includes(currentEndpoint[2]) &&
          !overrides.noBody.includes(camelCasedName)
            ? `body: ${overrides.body[camelCasedName] ?? `${tsTypeNameBase}JSONBody`},`
            : '';

        const formValueJS = overrides.form[camelCasedName]
          ? `form: ${overrides.form[camelCasedName]},`
          : '';

        const hasNoContent = mdContent.includes('204 No Content');
        const resultValueJS = `result: ${
          hasNoContent ? 'never' : overrides.result[camelCasedName] ?? `${tsTypeNameBase}Result`
        },`;

        const finalCodeSnippetTS = `  /**
   * ${jsdocMdContent.trim().replace(/\n/g, '\n   * ')}
   */
  ${camelCasedName}: Route<{
${[paramValueJS, queryValueJS, bodyValueJS, resultValueJS, fileValueJS, reasonValueJS, formValueJS]
  .filter(Boolean)
  .map(x => `    ${x}`)
  .join('\n')}
  }>,`;

        const finalCodeSnippetJS = `  ${camelCasedName}: {
    method: '${currentEndpoint[2]}',
    route: ${routeValueJS},${paramValueJS ? '\n    ' + paramValueJS : ''}${
          noAuth ? '\n    ' + noAuth : ''
        }
  },`;

        tsSource.push(finalCodeSnippetTS);
        jsSource.push(finalCodeSnippetJS);
      }

      mdContent = '';
      currentEndpoint = tempMatch;
    } else if (currentEndpoint) {
      mdContent += line + '\n';
    }
  }

  return {
    ts: `
export type ${exportName} = RouteGroup<{
${tsSource.join('\n')}
}>;
export declare const ${exportName}: RouteGroupClass<${exportName}>;
`,
    js: `
export const ${exportName} = group({
${jsSource.join('\n')}
});`,
  };
}

const data = Object.keys(routeMap).map(exportName =>
  transformContents({
    contents: readFileSync(routeMap[exportName]).toString(),
    exportName,
    filename: routeMap[exportName],
  })
);

const finalFileTS = `// This file is generated by scripts/gen-routes.js
// Do not modify directly.
// @no-line-count

import type * as Discord from 'discord-api-types/rest';
import type { FileData } from './types';
import type { Route, RouteGroup, RouteGroupClass } from './route-group';
${data.map(x => x.ts).join('\n')}`;

const finalFileJS = `// This file is generated by scripts/gen-routes.js
// Do not modify directly.
// @no-line-count

import { group } from './route-group';
${data.map(x => x.js).join('\n')}`;

writeFileSync('./src/routes.generated.d.ts', finalFileTS);
writeFileSync('./src/routes.generated.js', finalFileJS);
