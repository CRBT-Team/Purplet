<div align="center">
  <img alt="Purplet" src="https://github.com/CRBT-Team/Purplet/blob/main/sites/purplet.js.org/static/img/purplet-artwork.png?raw=true" >
  <h1>Purplet</h1>
  <h4>Next-gen framework to build modern Discord apps.</h4>
  <div>
    <img src="https://img.shields.io/badge/Discord_API-v10-c4aaff" alt="Discord API Version">
    <img src="https://img.shields.io/npm/v/purplet?color=c4aaff&label=version" alt="Version">
    <img src="https://img.shields.io/github/license/CRBT-Team/Purplet?color=c4aaff" alt="License">
    <img alt="GitHub commit activity (branch)" src="https://img.shields.io/github/commit-activity/m/CRBT-Team/Purplet?color=c4aaff">
    <a href="https://discord.gg/BFkHA8P7rh"><img src="https://img.shields.io/discord/995533040040292373?color=c4aaff&label=Discord&logo=discord&logoColor=white" alt="Discord"></a>
  </div>
</div>

## About Purplet

Built with [TypeScript](https://typescriptlang.org) and [Discord.js](https://discord.js.org/), this framework provides an easy way to build Discord applications that leverage Discord's interaction API. For example, all the code needed for a "Hello World" Slash Command is:

```ts
export const helloWorld = $slashCommand({
  name: 'hello',
  description: 'A simple "Hello, World" command.',

  async handle() {
    this.reply('Hello, World!');
  },
});
```

> ⚠️ Purplet v1 is pretty stable but we do not recommend using it to build new apps as Purplet 2, more documented and featureful, is being developed. Support for v1 is guaranteed until Purplet 2 becomes stable and fully replaces it, at which point v1 will be deprecated.

## Getting Started

The best way to get started is using `create-purplet` via your package manager's `create` command:

```
npm init purplet
# or
yarn create purplet
# or
pnpm create purplet
```

and follow the instructions it gives. Part of Purplet is documented [here](/docs/), and we encourage devs to check the [sample project](https://github.com/CRBT-Team/Purplet/tree/main/sample) for inspiration and guidance.

## License

Purplet is licensed under the [Apache 2.0 license](/LICENSE).
