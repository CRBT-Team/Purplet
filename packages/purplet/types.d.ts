declare module 'purplet' {
  const x: typeof import('./dist/index');
  export = x;
}

declare module 'purplet/discord-api-types' {
  const x: typeof import('./dist/discord-api-types');
  export = x;
}
