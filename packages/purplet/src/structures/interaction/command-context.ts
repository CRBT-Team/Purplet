import type { APIContextMenuInteraction } from 'discord-api-types/v10';
import { CommandInteraction } from './command';

export abstract class ContextCommandInteraction<
  Data extends APIContextMenuInteraction = APIContextMenuInteraction
> extends CommandInteraction<Data> {
  static is(obj: unknown): obj is ContextCommandInteraction {
    return obj instanceof ContextCommandInteraction;
  }

  get targetId() {
    return this.raw.data.target_id;
  }
}
