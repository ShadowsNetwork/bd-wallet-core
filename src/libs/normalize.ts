export function normalize(str?: string) {
  return (str || '').normalize('NFKD');
}
