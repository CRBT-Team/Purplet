import { Encoder } from './types';

/* "Base1048576", which encodes 20 bits per character. No longer works, I think. */
export const UnsafeUnicodeEncoder: Encoder = {
  encode(data: Uint8Array): string {
    let result = [];

    let endingWritten = false;

    let half = null;
    for (let i = 0; i < data.length; i += 2) {
      let thisHalf;
      if (!endingWritten) {
        thisHalf = (5 - ((data.length + 3) % 5)) % 5;
        endingWritten = true;
      } else if (half === null) {
        half = data[i + 2] & 0x0f;
        thisHalf = data[i + 2] >> 4;
      } else {
        thisHalf = half;
        half = null;
        i++;
      }

      const byte1 = data[i];
      const byte2 = data[i + 1];

      const code = (byte1 << 12) | (byte2 << 4) | thisHalf;

      result.push(code);
    }
    if (half !== null) {
      result.push(half);
    }

    return result.map((c) => String.fromCodePoint(c)).join('');
  },

  decode(data: string): Uint8Array {
    const arr = Array.from(data);
    const result = [];

    let ending = null;
    let half = null;
    for (const item of arr) {
      const codepoint = item.codePointAt(0)!;

      const thisHalf = codepoint & 0xf;
      if (ending === null) {
        ending = thisHalf;
      } else if (half === null) {
        half = thisHalf;
      } else {
        result.push(thisHalf | (half << 4));
        half = null;
      }

      result.push(codepoint >> 12);
      result.push((codepoint >> 4) & 0xff);
    }

    for (let i = 0; i < (ending ?? 0); i++) {
      result.pop();
    }

    return new Uint8Array(result);
  },
};
