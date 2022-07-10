// @types/node overrides setTimeout's return type, so I don't want to deal with ANY issues
type Timer = ReturnType<typeof setTimeout>;

/**
 * Implements heartbeating logic as specified in:
 * https://discord.com/developers/docs/topics/gateway#heartbeating.
 */
export class Heartbeater {
  timer: Timer;

  constructor(readonly interval: number, private readonly handler: () => void) {
    this.timer = setTimeout(() => this.beat(), interval * Math.random());
  }

  beat() {
    this.handler();
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.beat(), this.interval);
  }

  close() {
    clearTimeout(this.timer);
  }
}
