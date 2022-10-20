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

Our suite of packages is built from the ground up on Web Standards like `fetch`, allowing your code to run locally in Node.js, but also within cloud environments such as CF Workers, allowing you to deploy slash commands for free.

> ⚠️ Purplet is extremely experimental software with a rapidly changing API. We do not recommend using it in production at this point. When v2.0 is released, the API will be stable, it will still be considered experimental until we can ensure it's stability.

Full documentation on Purplet and how to get started is available at [purplet.js.org](https://purplet.js.org/docs/getting-started).

## Monorepo Contents

This repository contains these following public packages:

| Package | Description |
| --- | --- |
| [![purplet](https://img.shields.io/npm/v/purplet?color=c4aaff&label=purplet)](packages/purplet) | Full Framework for quickly building Discord Bots |
| ![@purplet/structures](https://img.shields.io/badge/%40purplet%2Fstructures-soon%E2%84%A2-red) | Classes wrapping Discord API objects |
| [![@purplet/rest](https://img.shields.io/npm/v/@purplet/rest?color=c4aaff&label=@purplet/rest)](packages/rest) | Rest client implementation |
| [![@purplet/gateway](https://img.shields.io/npm/v/@purplet/gateway?color=c4aaff&label=@purplet/gateway)](packages/gateway) | Gateway client implementation |
| ![@purplet/utils](https://img.shields.io/npm/v/@purplet/utils?color=c4aaff&label=@purplet/utils) | Helper utilities for Discord driven development |
| [![@purplet/serialize](https://img.shields.io/npm/v/@purplet/serialize?color=c4aaff&label=@purplet/serialize)](packages/serialize)\* | Utilities for binary serialization |
| [![create-purplet](https://img.shields.io/npm/v/purplet?color=c4aaff&label=create-purplet)](packages/create-purplet) | Project generation command, `pnpm create purplet` |

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
