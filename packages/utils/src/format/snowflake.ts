import type { Snowflake } from 'discord-api-types/globals';

export const DISCORD_EPOCH = 1420070400000;

export function snowflakeToDate(snowflake: bigint | Snowflake, epoch = DISCORD_EPOCH) {
  const ms = BigInt(snowflake) >> 22n;
  return new Date(Number(ms) + epoch);
}

export function dateToSnowflake(date: Date, epoch = DISCORD_EPOCH): Snowflake {
  const ms = BigInt(date.getTime() - epoch);
  return (ms << 22n).toString();
}

export type { Snowflake };
