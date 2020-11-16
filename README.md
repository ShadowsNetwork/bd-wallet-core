# potato-wallet-core
Potato Wallet Core is a typescript library that implements low-level cryptographic wallet functionality for many blockchains

# Usage
### Generate mnemonic
```typescript
// Default length: 128
const mnemonic = generateMnemonic();
const mnemonic = generateMnemonic(128);
```

### Mnemonic convert to entropy
```typescript
const entropy = mnemonicToEntropy(mnemonic);
```

### Mnemonic convert to seed
```typescript
const seed = mnemonicToSeed(mnemonic);
```
Feel free to provide a password as second parameter.
```typescript
const seed = mnemonicToSeed(mnemonic, 'Secret');
```
