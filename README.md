<div align="center">
  <img alt="Purplet" src="sites/purplet.js.org/static/img/purplet-artwork.png" >
  <h4>A simple framework to build modern Discord apps.</h4>
  <div>
    <img src="https://img.shields.io/npm/v/purplet?color=5865F2&label=version" alt="Version">
    <img src="https://img.shields.io/github/license/CRBT-Team/Purplet?color=5865F2" alt="License">
    <img alt="GitHub commit activity (branch)" src="https://img.shields.io/github/commit-activity/m/CRBT-Team/Purplet/v2?color=5865F2">
    <a href="https://discord.gg/AvwhNtsgAC"><img src="https://img.shields.io/discord/782584672298729473?color=5865F2&label=Discord&logo=discord&logoColor=white" alt="Discord"></a>
  </div>
</div>

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
npm init purplet@next
# or
yarn create purplet@next
# or
pnpm create purplet@next
```

and follow the instructions it gives. Documentation on purplet is available at [purplet.js.org](https://purplet.js.org/docs/getting-started).

## Monorepo Contents

| Package                                   | Changelog                                         |
| ----------------------------------------- | ------------------------------------------------- |
| [purplet](packages/purplet)               | [Changelog](packages/purplet/CHANGELOG.md)        |
| [create-purplet](packages/create-purplet) | [Changelog](packages/create-purplet/CHANGELOG.md) |
| [@purplet/serialize](packages/serialize)  | [Changelog](packages/serialize/CHANGELOG.md)      |

| Example Projects        | Create                         |
| ----------------------- | ------------------------------ |
| [Basic](examples/basic) | `pnpm create purplet -t basic` |

## Bots using Purplet

- [CRBT](https://crbt.app/) (closed source)

> Have an open-source bot of your own you'd like to feature? [Open an GitHub issue](https://github.com/CRBT-Team/Purplet/issues) and we may add it here!

## License

Purplet is licensed under the [Apache License 2.0](https://github.com/CRBT-Team/Purplet/blob/main/LICENSE).
