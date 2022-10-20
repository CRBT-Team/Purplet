<div align="center">
  <img alt="Purplet" src="sites/purplet.js.org/static/img/purplet-artwork.png" >
  <h1>Purplet</h1>
  <h4>Next-gen tools to build modern Discord apps.</h4>
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

This repository contains these following public packages:

| Package | Description |
| --- | --- |
| [![purplet](https://img.shields.io/npm/v/purplet?color=c4aaff&label=purplet)](packages/purplet) | Full Framework for quickly building Discord Bots |
| [![@purplet/rest](https://img.shields.io/npm/v/@purplet/rest?color=c4aaff&label=@purplet/rest)](packages/rest) | Rest client implementation |
| [![@purplet/gateway](https://img.shields.io/npm/v/@purplet/gateway?color=c4aaff&label=@purplet/gateway)](packages/gateway) | Gateway client implementation |
| ![@purplet/structures](https://img.shields.io/badge/%40purplet%2Fstructures-soon%E2%84%A2-red) | Classes wrapping Discord API objects |
| ![@purplet/utils](https://img.shields.io/badge/%40purplet%2Futils-soon%E2%84%A2-red) | Helper utilities for Discord driven development |
| [![@purplet/serialize](https://img.shields.io/npm/v/@purplet/serialize?color=c4aaff&label=@purplet/serialize)](packages/serialize)\* | Utilities for binary serialization |
| [![create-purplet](https://img.shields.io/npm/v/purplet?color=c4aaff&label=create-purplet)](packages/create-purplet) | Project generation command, `pnpm create purplet` |

<!-- | ![@purplet/builders](https://img.shields.io/badge/%40purplet%2Fbuilders-soon%E2%84%A2-red) | Builder-style classes to create Discord API objects | -->
<!-- | ![buncord](https://img.shields.io/badge/buncord-soon%E2%84%A2-red) | Library to easily interact with the Discord API | -->

<sup>\*is not discord-specific, which might make it useful out of the context of Discord Bots.</sup>

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
