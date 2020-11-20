# bd-wallet-core
Black Diamond Wallet Core is a typescript library that implements low-level cryptographic wallet functionality for many blockchain

[![License](https://img.shields.io/github/license/bdwallet/bd-wallet-core)](https://github.com/bdwallet/bd-wallet-core/blob/master/LICENSE)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/bdwallet/bd-wallet-core/CI/master)](https://github.com/bdwallet/bd-wallet-core/actions)
[![Codecov](https://img.shields.io/codecov/c/github/bdwallet/bd-wallet-core)](https://codecov.io/gh/bdwallet/bd-wallet-core)


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
