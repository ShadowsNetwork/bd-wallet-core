export function leftPad(str: string, padString: string, length: number) {
  while (str.length < length) {
      str = padString + str;
  }
  return str;
}
