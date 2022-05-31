import type { APIContextMenuInteraction } from 'discord.js';
import { PurpletCommandInteraction } from './command';

export abstract class PurpletContextCommandInteraction<
  Data extends APIContextMenuInteraction = APIContextMenuInteraction
> extends PurpletCommandInteraction<Data> {
  get targetId() {
    return this.raw.data.target_id;
  }
}
