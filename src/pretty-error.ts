/* Based on https://github.com/watson/error-callsites */
import { codeFrameColumns } from '@babel/code-frame';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

function filterLines(original: string) {
  const line = original.replace(/\s+/g, ' ').replace(/\\/g, '/');

  if (line.includes('discord.js/src/client/websocket')) return false;
  if (line.includes('node:events')) return false;
  if (line.includes('WebSocket.onMessage')) return false;

  return true;
}

function cleanStackTraces(any: unknown) {
  if (any instanceof Error) {
    if (any.stack) {
      return (
        '\n' +
        any.stack
          .split('\n')
          .map((line, i) => {
            if (i === 0) {
              return chalk.bgRed.bold.white(` ${any.name} `) + chalk.redBright(' ' + any.message);
            }
            if (!line.startsWith('    at')) return line;
            if (!filterLines(line)) return null;

            return line.replace(
              /at (.*) \((?:file:\/+)?(.*):(\d+):(\d+)\)/,
              (_, prefix, file, line, col) => {
                function getModuleName() {
                  const thisFile = import.meta.url.replace(/^file:\/+/, '');
                  if (thisFile === file) {
                    return `(${chalk.magentaBright('purplet')})`;
                  }
                  if (file.startsWith('node:')) {
                    return `(${chalk.white('node.js')})`;
                  }
                  const nodeModuleMatch = file.match(/node_modules(?:\/|\\)(.+?)(?:\/|\\|$)/);
                  if (nodeModuleMatch) {
                    return `(${chalk.cyanBright(nodeModuleMatch[1])})`;
                  }
                  const relativePath = path.relative(process.cwd(), file);
                  const end = chalk.cyanBright(`:${line}:${col}`);
                  if (relativePath.startsWith('..')) {
                    return `(${chalk.greenBright(path.resolve(file))}${end})`;
                  } else {
                    return (
                      `(${chalk.greenBright(relativePath)}${end})\n` +
                      codeFrameColumns(
                        fs.readFileSync(file).toString(),
                        { start: { line: parseInt(line), column: parseInt(col) } },
                        {
                          highlightCode: true,
                          linesAbove: 1,
                          linesBelow: 1,
                        }
                      )
                    );
                  }
                }
                return `at ${prefix} ${getModuleName()}`;
              }
            );
          })
          .filter(Boolean)
          .join('\n') +
        '\n'
      );
    }
    return chalk.bgRed.bold.white(` ${any.name} `) + chalk.redBright(' ' + any.message) + '\n';
  }
  return any;
}

function handleError(error: Error) {
  console.error(cleanStackTraces(error));
}

export function setupPrettyErrors() {
  process.on('uncaughtException', handleError);
  process.on('unhandledRejection', handleError);
}
