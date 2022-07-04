declare module 'purplet' {
  const x: typeof import('./dist/index');
  export = x;
}

declare module 'purplet/discord-api-types' {
  const y: typeof import('./dist/discord-api-types');
  export = y;
}
