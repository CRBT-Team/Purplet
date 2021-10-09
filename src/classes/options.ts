type ChoiceName = string;
type ChoiceValue = string;

export default class CommandOption {
  name?: string;
  description?: string;
  type?: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'INTEGER' | 'MENTIONABLE' | 'CHANNEL' | 'USER' | 'ROLE' | 'SUB_COMMAND';
  required?: boolean;
  choices?: { name: ChoiceName[], value: ChoiceValue[]};
  options?: CommandOption[];

  setName(name: string) {
    name: this.name
  }

  setDescription(description: string) {
    description: this.description
  }
}