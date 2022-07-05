import chalk from 'chalk';
import ora from 'ora';
import stringLength from 'string-length';
import wrapAnsi from 'wrap-ansi';
import { inspect } from 'util';

const status = ora();

let showDebug = false;

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'purplet' | 'none';
type LogFormatters = Record<LogLevel, (content: string) => string>;

const colors: LogFormatters = {
  debug: chalk.cyanBright,
  info: chalk.blueBright,
  warn: chalk.yellow,
  error: chalk.red,
  none: x => x,
  purplet: x => x,
};

const textColors: Partial<LogFormatters> = {
  warn: chalk.yellowBright,
  error: chalk.redBright,
  purplet: chalk.magentaBright.bold,
};

function logString(level: LogLevel, data: string) {
  if (level === 'debug' && !showDebug) return;
  if (data === '') {
    process.stdout.write('\n');
    return;
  }
  const prefix =
    level === 'purplet'
      ? ''
      : level === 'none'
      ? ' '.repeat(6)
      : chalk.bold(`${colors[level](level.padEnd(5, ' '))}`) + ' ';
  const prefixLength = stringLength(prefix);
  const wrapped = wrapAnsi(textColors[level]?.(data) ?? data, 80 - 6, {
    trim: false,
    hard: true,
  }).replace(/\n/g, '\n' + ' '.repeat(prefixLength));
  const output = prefix + wrapped + '\n' + (level === 'error' ? '\n' : '');
  if (status.isSpinning) {
    status.clear();
    process.stdout.write(output);
    status.render();
  } else {
    process.stdout.write(output);
  }
}

function stringify(...data: any[]) {
  return data.map(obj => (typeof obj === 'string' ? obj : inspect(obj, false, 4, true))).join(' ');
}

export function log(level: LogLevel, ...data: any[]) {
  logString(level, stringify(...data));
}

export function startSpinner(label: string) {
  return status.start(label);
}

export function injectLogger() {
  console.log = (...args: any[]) => log('info', ...args);
  console.warn = (...args: any[]) => log('warn', ...args);
  console.error = (...args: any[]) => log('error', ...args);
  console.debug = (...args: any[]) => log('debug', ...args);
  // TODO: injections for the rest of the log methods, like `time`
}

export async function pauseSpinner(fn: () => void) {
  if (status.isSpinning) {
    status.stop();
    await fn();
    status.start();
  } else {
    fn();
  }
}

export function setVerbose(verbose: boolean) {
  showDebug = verbose;
}
