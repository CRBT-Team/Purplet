import type { APIContextMenuInteraction } from 'discord-api-types/v10';
import { CommandInteraction } from './command';

export abstract class ContextCommandInteraction<
  Data extends APIContextMenuInteraction = APIContextMenuInteraction
> extends CommandInteraction<Data> {
  get targetId() {
    return this.raw.data.target_id;
  }
}
