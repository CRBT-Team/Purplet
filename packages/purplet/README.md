## About Purplet

Purplet is a Discord bot framework that splits your features into small, hot-reloadable modules, allowing you to move your focus to quickly building your bot ideas. For example, all the code needed for a "Hello World" Slash Command is:

```ts
export const helloWorld = $slashCommand({
  name: 'hello',
  description: 'A simple "Hello, World" command.',

  async handle() {
    this.showMessage('Hello, World!');
  },
});
```

> ⚠️ Purplet v2 is a complete rewrite and API overhaul. While still experimental, it is more documented and featureful than the [v1 branch][v1]. Please hold off deploying bots built with this to production until the official 2.0.0 releases, but feel free to try it out.

[1]: https://purplet.js.org/docs/slash-commands.html
[v1]: https://github.com/CRBT-Team/Purplet/tree/main

## Getting Started

The best way to get started is using `create-purplet` via your package manager's `create` command:

```sh
npm init purplet
# or
yarn create purplet
# or
pnpm create purplet
```

and follow the instructions it gives. Documentation on purplet is available at [purplet.js.org](https://purplet.js.org/docs/getting-started).

## License

Purplet is licensed under the [Apache License 2.0](https://github.com/CRBT-Team/Purplet/blob/main/LICENSE).
