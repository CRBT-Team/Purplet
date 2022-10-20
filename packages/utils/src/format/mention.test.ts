import dayjs from 'dayjs';
import { describe, expect, test } from 'bun:test';
import { TimestampFormat, timestampMention } from './mentions';

describe('timestampMention', () => {
  const ms = 1083356400000;
  const seconds = Math.floor(ms / 1000);
  test('no format', () => {
    expect(timestampMention(ms)).toBe(`<t:${seconds}>`);
  });
  test('ShortDateTime format is equal to no format', () => {
    expect(timestampMention(ms, TimestampFormat.ShortDateTime)).toBe(`<t:${seconds}>`);
  });
  test('format options', () => {
    expect(timestampMention(ms, 'D')).toBe(`<t:${seconds}:D>`);
    expect(timestampMention(ms, 'F')).toBe(`<t:${seconds}:F>`);
    expect(timestampMention(ms, 'R')).toBe(`<t:${seconds}:R>`);
    expect(timestampMention(ms, 'T')).toBe(`<t:${seconds}:T>`);
    expect(timestampMention(ms, 'd')).toBe(`<t:${seconds}:d>`);
    expect(timestampMention(ms, 't')).toBe(`<t:${seconds}:t>`);
  });
  test('Date object support', () => {
    expect(timestampMention(new Date(ms))).toBe(timestampMention(ms));
  });
  test('DayJS support', () => {
    expect(timestampMention(dayjs(ms))).toBe(timestampMention(ms));
  });
});
