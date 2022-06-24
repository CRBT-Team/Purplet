import chalk from 'chalk';
import wrap from 'wrap-ansi';
import stringLength from 'string-length';
import ora from 'ora';

const status = ora();

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'purplet';
type LogFormatters = Record<LogLevel, (content: string) => string>;

const colors: LogFormatters = {
  debug: chalk.cyanBright,
  info: chalk.blueBright,
  warn: chalk.yellow,
  error: chalk.red,
  purplet: x => x,
};

const textColors: Partial<LogFormatters> = {
  warn: chalk.yellowBright,
  error: chalk.redBright,
  purplet: chalk.magentaBright.bold,
};

function logString(level: LogLevel, data: string) {
  const terminalWidth = process.stdout.columns;
  const prefix = level === 'purplet' ? '' : chalk.bold(`${colors[level](level.padEnd(5, ' '))}`) + ' ';
  const prefixLength = stringLength(prefix);
  const wrapped = wrap(textColors[level]?.(data) ?? data, terminalWidth - prefixLength).replace(
    /\n/g,
    '\n' + ' '.repeat(prefixLength)
  );
  const output = (prefix + wrapped + '\n') + (level === 'error' ? '\n' : '');
  if (status.isSpinning) {
    status.clear();
    process.stdout.write(output);
    status.render();
  } else {
    process.stdout.write(output);
  }
}

export function log(level: LogLevel, ...data: any[]) {
  logString(level, data.map(d => String(d)).join(' '));
}

export function startSpinner(label: string) {
  return status.start(label);
}

export function injectLogger() {
  console.log = (...args: any[]) => log('info', args);
  console.warn = (...args: any[]) => log('warn', args);
  console.error = (...args: any[]) => log('error', args);
  console.debug = (...args: any[]) => log('debug', args);
  // TODO: injections for the rest of the log methods, like `time`
}