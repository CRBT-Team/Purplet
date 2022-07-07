import { unique } from '@davecode/utils';
import {
  APIApplicationCommandBasicOption,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  GatewayPresenceUpdateData,
  LocalizationMap,
  PresenceUpdateStatus,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'purplet/types';
import { IntentsHookData, PresenceHookData, PresenceStatus } from './hook-core';
import { IntentsBitfield } from '../structures';

export function mergeIntents(intents: IntentsHookData[]) {
  return IntentsBitfield.resolve(intents).bitfield;
}

const statusOrder = [
  PresenceStatus.Online,
  PresenceStatus.Idle,
  PresenceStatus.DoNotDisturb,
  PresenceStatus.Invisible,
];

export function mergePresence(presences: PresenceHookData[]): GatewayPresenceUpdateData {
  const obj: GatewayPresenceUpdateData = {
    afk: false,
    activities: [],
    since: null,
    status: PresenceStatus.Online as string as PresenceUpdateStatus,
  };

  for (const entry of presences) {
    if (entry.afk) obj.afk = true;
    if (entry.activities) {
      obj.activities.push(...entry.activities);
    }
    if (entry.since) {
      obj.since = Math.max(obj.since ?? 0, entry.since);
    }
    if (
      entry.status &&
      statusOrder.indexOf(entry.status) >
        statusOrder.indexOf(obj.status as string as PresenceStatus)
    ) {
      obj.status = entry.status as string as PresenceUpdateStatus;
    }
  }

  return obj;
}

type Command = RESTPostAPIApplicationCommandsJSONBody;
type SlashCommand = RESTPostAPIChatInputApplicationCommandsJSONBody;

export interface SlashCommandGroupDataResolved {
  name: string;
  nameLocalizations?: LocalizationMap;
  description: string;
  descriptionLocalizations?: LocalizationMap;
  default_member_permissions?: string;
  dm_permission?: boolean;
  isSlashCommandGroup: true;
}

export type ApplicationCommandResolvable = Command | SlashCommandGroupDataResolved;

export function mergeCommands(_list: ApplicationCommandResolvable[]) {
  /** I am sorry... */
  const list: any[] = _list;

  const groups = list.filter(x => 'isSlashCommandGroup' in x && !x.name.includes(' '));

  const toBeMerged = (list as any[]).filter(
    x =>
      (x.type === ApplicationCommandType.ChatInput || x.isSlashCommandGroup) && x.name.includes(' ')
  );

  const commandNamesToBeMerged = unique(toBeMerged.map(x => x.name.split(' ')[0]));
  const rest = list.filter(x => !toBeMerged.includes(x) && !groups.includes(x as any));

  for (const name of commandNamesToBeMerged) {
    const group = groups.find(x => x.name === name);
    if (!group) {
      throw new Error(`Could not find slash command group "${name}"`);
    }

    const cmd: SlashCommand = {
      name: name,
      type: ApplicationCommandType.ChatInput,
      options: [],
      description: group.description,
    };

    const merged = toBeMerged.filter(x => x.name.startsWith(name + ' '));

    if (merged.some(x => x.name.split(' ').length === 3)) {
      cmd.options = merged
        .filter(x => x.name.split(' ').length === 2)
        .map(x => ({
          name: x.name.split(' ')[1],
          type: ApplicationCommandOptionType.SubcommandGroup,
          description: x.description,
          name_localizations: x.name_localizations,
          description_localizations: x.description_localizations,
          options: merged
            .filter(y => y.name.startsWith(name + ' ' + x.name.split(' ')[1] + ' '))
            .map(y => ({
              name: y.name.split(' ')[2],
              type: ApplicationCommandOptionType.Subcommand,
              description: y.description,
              name_localizations: y.name_localizations,
              description_localizations: y.description_localizations,
              options: y.options as APIApplicationCommandBasicOption[],
            })),
        }));
    } else {
      cmd.options = merged.map(x => ({
        name: x.name.split(' ')[1],
        type: ApplicationCommandOptionType.Subcommand,
        description: x.description,
        name_localizations: x.name_localizations,
        description_localizations: x.description_localizations,
        options: x.options as APIApplicationCommandBasicOption[],
      }));
    }

    rest.push(cmd);
  }

  return rest;
}
