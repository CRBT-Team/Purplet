<div align="center">
  <img alt="Purplet" src="https://user-images.githubusercontent.com/67973777/169643730-2b03ecb8-3510-471f-8e3d-2c2485750962.png">

  <h4>A simple framework to build modern Discord apps.</h4>
  
  <div>
    <img src="https://img.shields.io/npm/v/purplet?color=F27187&label=version" alt="Version">
    <img src="https://img.shields.io/github/license/CRBT-Team/Purplet?color=F27187" alt="License">
    <a href="https://npmjs.org/package/purplet"><img src="https://img.shields.io/npm/dt/purplet?color=CB0000&logo=npm&logoColor=white" alt="npm"></a>
    <a href="https://discord.gg/AvwhNtsgAC"><img src="https://img.shields.io/discord/782584672298729473?color=5865F2&label=Discord&logo=discord&logoColor=white" alt="Discord"></a>
  </div>
</div>

## About Purplet

Purplet is a discord framework where your bot features are defined in small modules that can be reloaded instantly. Iterate your ideas faster than ever with the combined powers of [TypeScript][1], [Vite][2], and [Discord.js][3].

> ⚠️ Purplet v2 is a rewrite of the framework. Most features from [v1][v1] have not yet been ported, and only the core basics function. Proceed with caution.

[1]: https://www.typescriptlang.org/
[2]: https://vitejs.dev/
[3]: https://discord.js.org/
[v1]: https://github.com/CRBT-Team/Purplet/tree/main

## Getting Started

The best way to get started is using `create-purplet` via your package manager's create command:

```sh
npm init purplet@next
# or
yarn create purplet@next
# or
pnpm create purplet@next
```

and follow the instructions it gives.

## Repository Contents

| Package                                   | Changelog                                         |
| ----------------------------------------- | ------------------------------------------------- |
| [purplet](packages/purplet)               | [Changelog](packages/purplet/CHANGELOG.md)        |
| [create-purplet](packages/create-purplet) | [Changelog](packages/create-purplet/CHANGELOG.md) |

| Example Projects        |
| ----------------------- |
| [Basic](examples/basic) |

## License

Purplet is licensed under the [Apache License 2.0](https://github.com/CRBT-Team/Purplet/blob/main/LICENSE).
