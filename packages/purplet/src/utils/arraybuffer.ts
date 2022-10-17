export function hexStringToUint8Array(str: string) {
  const arr = new Uint8Array(str.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(str.slice(i * 2, i * 2 + 2), 16);
  }
  return arr;
}
