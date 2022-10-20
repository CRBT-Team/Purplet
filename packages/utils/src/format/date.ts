export const DISCORD_EPOCH = 1420070400000;

export function snowflakeToDate(snowflake: bigint | string, epoch: number = DISCORD_EPOCH) {
  const ms = BigInt(snowflake) >> 22n;
  return new Date(Number(ms) + epoch);
}
