import { RESTJSONErrorCodes } from 'discord-api-types/rest';

interface APIJSONError {
  code: RESTJSONErrorCodes;
  message: string;
  errors: APIErrorObject;
}

interface APIErrorWithKeypath extends APIErrorEntry {
  keypath: string;
}

type APIErrorObject = { _errors: APIErrorEntry[] } & { [key: string]: APIErrorObject };

interface APIErrorEntry {
  code: string;
  message: string;
}

function getErrorList(error: APIErrorObject, keypath = ''): APIErrorWithKeypath[] {
  const errors: APIErrorWithKeypath[] = [];
  for (const key in error) {
    errors.push(
      ...(key === '_errors'
        ? error[key].map(error => ({ ...error, keypath: `${keypath}` }))
        : getErrorList(error[key], `${keypath}${key.match(/^\d+$/) ? `[${key}]` : `.${key}`}`))
    );
  }
  return errors;
}

export class DiscordAPIError extends Error {
  #errorList: APIErrorWithKeypath[];

  status: number;
  statusText: string;
  code: RESTJSONErrorCodes;
  url: string;

  constructor(rawError: APIJSONError, response: Response, options?: ErrorOptions) {
    const errors = getErrorList(rawError.errors);
    const formattedList = getErrorList(rawError.errors)
      .map(e => ` - ${e.keypath}: ${e.message}`)
      .join('\n');
    super(rawError.message + (formattedList ? `\n${formattedList}` : ''), options);
    this.status = response.status;
    this.statusText = response.statusText;
    this.code = rawError.code;
    this.url = response.url;
    this.#errorList = errors;
  }

  get errors() {
    return this.#errorList;
  }
}
