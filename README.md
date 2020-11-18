# bd-wallet-core
Black Diamond Wallet Core is a typescript library that implements low-level cryptographic wallet functionality for many blockchain

# Usage
### Create wallet
```typescript
const wallet = new Wallet();
// OR specific length
const wallet = new Wallet(128);
```

### Restore wallet
```typescript
const wallet = new Wallet('hello world random string');
```

### With cache password
```typescript
new Wallet(128, 'Secret');
new Wallet('hello world random string', 'Secret');
```

### Get default address
The supported coins are `BTC` and `ETH`, and more coins will be included in the future.
```typescript
const address = wallet.getAddress('BTC');
```
