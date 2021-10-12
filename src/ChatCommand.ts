import { CommandInteraction, Interaction } from "discord.js";
import { createHandler } from "./Handler";
import { IOptionBuilder, GetOptionsFromBuilder } from "./OptionBuilder";

export interface ChatCommandData<O extends IOptionBuilder = IOptionBuilder> {
  name: string;
  description: string;
  options: O;
  handle: (this: CommandInteraction, options: GetOptionsFromBuilder<O>) => void;
}

const commands = new Map<string, ChatCommandData>();

function handleInteraction(interaction: Interaction) {
  //
}

const ChatCommandHandler = createHandler<ChatCommandData>({
  /* run to setup this handler, run after all items are registered */
  init() {
    this.client.on("interaction", handleInteraction);
  },
  /* run to destroy this handler, run before all items are unregistered */
  destroy() {
    this.client.off("interaction", handleInteraction);
  },
  /** register and unregister should just modify the maps, not publish to the discord api, or do anything async. the id provided is unique based on where it is defined in the user's code. */
  register(id, data) {
    commands.set(data.name, data);
  },
  unregister(id, data) {
    commands.delete(data.name);
  },
  /* update is called when an instance is updated, run after the unregister and register process is done */
  update(id, data) {
    //
  },
});

export function ChatCommand<O extends IOptionBuilder>(data: ChatCommandData<O>) {
  return ChatCommandHandler.createInstance(data);
}
