declare module 'purplet' {
  const purplet: typeof import('./dist/index');
  export = purplet;
}

declare module 'purplet/types' {
  export * from 'discord-api-types/v10';
}

declare module 'purplet/env' {
  const env: typeof import('./dist/env');
  export = env;
}
