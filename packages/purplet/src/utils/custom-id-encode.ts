// using all unicode characters from range 0 to 0x10FFFF, encode two and a half bytes per character
export function encodeCustomId(data: Uint8Array) {
  let output = '';
  for (let i = 0; i < data.length; i += 5) {
    const one = data[i];
    const two = data[i + 1];
    const three = data[i + 2];
    const four = data[i + 3];
    const five = data[i + 4];

    // byte one contains one + two + the least significant bits of three
    const codePoint1 = (one << 12) | (two << 4) | (three & 0b1111);
    // byte two contains four + five + the most significant bits of three
    const codePoint2 = (four << 12) | (five << 4) | (three >> 4);

    output += String.fromCodePoint(codePoint1) + String.fromCodePoint(codePoint2);
  }

  return output;
}

export function decodeCustomId(data: string) {
  const codePoints = [...data];
  const output = new Uint8Array(Math.ceil(codePoints.length * 2.5));
  let j = 0;

  for (let i = 0; i < codePoints.length; i += 2, j += 5) {
    const codePoint1 = codePoints[i].codePointAt(0)!;
    const codePoint2 = codePoints[i + 1].codePointAt(0)!;

    output[j] = (codePoint1 >>> 12) & 0xff;
    output[j + 1] = (codePoint1 >>> 4) & 0xff;
    output[j + 2] = (codePoint1 & 0xf) | ((codePoint2 & 0xf) << 4);
    output[j + 3] = (codePoint2 >>> 12) & 0xff;
    output[j + 4] = (codePoint2 >>> 4) & 0xff;
  }
  return output;
}
