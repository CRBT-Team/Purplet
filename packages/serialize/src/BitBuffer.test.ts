import { describe, expect, it } from 'bun:test';
import { BitBuffer } from './BitBuffer';

describe('BitBuffer', () => {
  it('read(1)', () => {
    const arr = new Uint8Array([0b10101010, 0b11100100]);
    const buf = new BitBuffer(arr);
    expect(buf.read()).toBe(0);
    expect(buf.read()).toBe(1);
    expect(buf.read()).toBe(0);
    expect(buf.read()).toBe(1);
    expect(buf.read()).toBe(0);
    expect(buf.read()).toBe(1);
    expect(buf.read()).toBe(0);
    expect(buf.read()).toBe(1);

    expect(buf.read()).toBe(0);
    expect(buf.read()).toBe(0);
    expect(buf.read()).toBe(1);
    expect(buf.read()).toBe(0);
    expect(buf.read()).toBe(0);
    expect(buf.read()).toBe(1);
    expect(buf.read()).toBe(1);
    expect(buf.read()).toBe(1);
  });
  it('read(n)', () => {
    const arr = new Uint8Array([0b10101010, 0b11100100]);
    const buf = new BitBuffer(arr);

    expect(buf.read(8)).toBe(0b10101010);
    expect(buf.read(8)).toBe(0b11100100);
  });
  it('write(x, 1)', () => {
    const arr = new Uint8Array([0, 0]);
    const buf = new BitBuffer(arr);
    buf.write(1);
    buf.write(0);
    buf.write(0);
    buf.write(1);
    buf.write(1);
    buf.write(0);
    buf.write(0);
    buf.write(1);

    buf.write(1);
    buf.write(1);
    buf.write(0);
    buf.write(0);
    buf.write(1);
    buf.write(0);
    buf.write(0);
    buf.write(1);

    expect(arr[0]).toBe(0b10011001);
    expect(arr[1]).toBe(0b10010011);
  });
  it('write(x, n)', () => {
    const arr = new Uint8Array([0, 0]);
    const buf = new BitBuffer(arr);
    buf.write(0b10101010, 8);
    buf.write(0b11100100, 8);
    expect(arr[0]).toBe(0b10101010);
    expect(arr[1]).toBe(0b11100100);
  });
});
