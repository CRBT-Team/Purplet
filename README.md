<div align="center">
  <img alt="Purplet" src="sites/purplet.js.org/static/img/purplet-artwork.png" >
  <h4>A simple framework to build modern Discord bots.</h4>
  <div>
    <img src="https://img.shields.io/badge/Discord_API-v10-c4aaff" alt="Discord API Version">
    <img src="https://img.shields.io/npm/v/purplet?color=c4aaff&label=version" alt="Version">
    <img src="https://img.shields.io/github/license/CRBT-Team/Purplet?color=c4aaff" alt="License">
    <img alt="GitHub commit activity (branch)" src="https://img.shields.io/github/commit-activity/m/CRBT-Team/Purplet?color=c4aaff">
    <a href="https://discord.gg/BFkHA8P7rh"><img src="https://img.shields.io/discord/995533040040292373?color=c4aaff&label=Discord&logo=discord&logoColor=white" alt="Discord"></a>
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

[v1]: https://github.com/CRBT-Team/Purplet/tree/v1

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

## Monorepo Contents

Aside from `purplet`, our project contains these following public packages:

| Package | Description | Changelog |
| --- | --- | --- |
| [purplet](packages/purplet) | Vite + Discord API abstractions + gateway client + more | [Changelog](packages/purplet/CHANGELOG.md) |
| [create-purplet](packages/create-purplet) | Project generator CLI | [Changelog](packages/create-purplet/CHANGELOG.md) |
| [@purplet/gateway](packages/gateway) | Gateway Client implementation | [Changelog](packages/gateway/CHANGELOG.md) |
| [@purplet/rest](packages/rest) | Gateway Client implementation | [Changelog](packages/rest/CHANGELOG.md) |
| [@purplet/serialize](packages/serialize) | Utilities for binary serialization | [Changelog](packages/serialize/CHANGELOG.md) |

The `examples` folder contains one framework example as of right now:

| Example Projects        | Command to copy                |
| ----------------------- | ------------------------------ |
| [Basic](examples/basic) | `pnpm create purplet -t basic` |

## Bots using Purplet

- [CRBT](https://crbt.app/) (closed source)

> Have an open-source bot of your own you'd like to feature? [Open an GitHub issue](https://github.com/CRBT-Team/Purplet/issues) and we may add it here!

## Contributing

See the [contributing guide](CONTRIBUTING.md) for information on how we accept contributions, as well as an overview of the codebase.

## License

Purplet is licensed under the [Apache License 2.0](https://github.com/CRBT-Team/Purplet/blob/main/LICENSE).
