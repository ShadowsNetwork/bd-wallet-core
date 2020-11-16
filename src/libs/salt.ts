export function salt(password?: string) {
  return 'mnemonic' + (password || '');
}
