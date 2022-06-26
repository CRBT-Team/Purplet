import type { Class } from '@davecode/types';
import type { APIContextMenuInteraction } from 'discord-api-types/v10';
import { CommandInteraction } from './command';
import { createInstanceofGuard } from '../../utils/class';

export abstract class ContextCommandInteraction<
  Data extends APIContextMenuInteraction = APIContextMenuInteraction
> extends CommandInteraction<Data> {
  // This `is` definition requires the casting because it is abstract
  static is = createInstanceofGuard(CommandInteraction as unknown as Class<CommandInteraction>);

  get targetId() {
    return this.raw.data.target_id;
  }
}
