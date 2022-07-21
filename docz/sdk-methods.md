---
name: All methods
route: /sdk-methods
menu: SDK
---

# SolidoSDK all methods

---

## Staking

---

### getStakeTransaction

_Prepares & returns stake transaction (uses Transaction class from @solana/web3.js)_

- *`amount`* - The amount of SOL-s which need to stake
- *`payerAddress`* - address of user who is trying to make the transaction (`wallet.publicKey`)

### calculateMaxStakeAmount

_Returns maximum available SOL-s to stake for given address_

- *`payerAddress`* - address of user (`wallet.publicKey`)

### stake

_Signs and confirms stake transaction. Returns transaction hash._

- *`transaction`* - Ready [@solana/web3.js](https://www.npmjs.com/package/@solana/web3.js) Transaction, got from `getStakeTransaction`.
- *`wallet`* - Wallet instance from [@solana/wallet-adapter-base](https://www.npmjs.com/package/@solana/wallet-adapter-base).
- *`setTxStage`* - Optional callback for getting information about transaction stage.

<br />

## UnStaking

---

### getUnStakeTransaction

_Prepares & returns unStake transaction (uses Transaction class from @solana/web3.js)_

- *`amount`* - The amount of stSOL which need to unStake
- *`payerAddress`* - address of user who is trying to make the transaction (`wallet.publicKey`)

### calculateMaxUnStakeAmount

_Returns maximum available stSOL-s to unStake for given address_

- *`payerAddress`* - address of user (`wallet.publicKey`)

### unStake

_Signs and confirms unStake transaction. Returns transaction hash._

- *`transaction`* - Ready [@solana/web3.js](https://www.npmjs.com/package/@solana/web3.js) Transaction, got from `getUnStakeTransaction`.
- *`wallet`* - Wallet instance from [@solana/wallet-adapter-base](https://www.npmjs.com/package/@solana/wallet-adapter-base).
- *`setTxStage`* - Optional callback for getting information about transaction stage.

<br />

## Transaction info

---

### getExchangeRate

_Returns exchange rate for stSOL-SOL_

- *`precision`* - the number of digits to appear after the decimal point (`default = 4. Example: 1 stSOL = ~1.0485 SOL`)

### getTransactionCost

_Returns transaction cost for given instruction_

- *`instruction`* - INSTRUCTION code

### getStakingRewardsFee

_Returns staking rewards fee percent with it description_

### getTransactionInfo

_Returns the united response of the previous functions (`exchangeRate`, `transactionCost`, `stakingRewardsFee`)_

- *`instruction`* - INSTRUCTION code

<img src={require('./assets/transactionInfo.png')} alt="Transaction Info" />

<br />

## Lido statistics

---

### getTotalStaked

_Returns total staked SOL-s_

- *`precision`* - the number of digits to appear after the decimal point (`default = 2. Example: 2,620,337.84 SOL`)

### getStakersCount

_Returns the number of non-empty stSOL accounts_

### getMarketCap

_Returns stSOL market cap in $_

- *`totalStakedInSol`* - total staked SOL-s


### getLidoStatistics

_Returns the united response of the previous functions (`totalStaked`, `stakersCount`, `marketCap`, also `apy`)_

<img src={require('./assets/lidostatistics.png')} alt="Lido Statistics" />
