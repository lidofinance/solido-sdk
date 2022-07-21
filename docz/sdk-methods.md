---
name: All methods
route: /sdk-methods
menu: SDK
---

# SolidoSDK all methods

---

### getStakeTransaction

_Prepare & return stake transaction (uses Transaction class from @solana/web3.js)_

- *`amount`* - SOL amount to stake transaction
- *`payerAddress`* - address of user who is trying to make transaction

### getUnStakeTransaction

_Prepare & return unStake transaction (uses Transaction class from @solana/web3.js)_

- *`amount`* - stSOL amount to unStake transaction
- *`payerAddress`* - address of user who is trying to make transaction

### calculateMaxStakeAmount

_Returns maximum available SOL-s to stake for given address_

- *`payerAddress`* - address of user

### calculateMaxUnStakeAmount

_Returns maximum available StSOL-s to unStake for given address_

- *`payerAddress`* - address of user

### stake

_Sign and confirm stake transaction. Returns transaction hash._

- *`transaction`* - Ready [@solana/web3.js](https://www.npmjs.com/package/@solana/web3.js) Transaction, got from `getStakeTransaction`.
- *`wallet`* - Wallet instance from [@solana/wallet-adapter-base](https://www.npmjs.com/package/@solana/wallet-adapter-base).
- *`setTxStage`* - Optional callback for getting information about transaction stage.

### unStake

_Sign and confirm unStake transaction. Returns transaction hash._

- *`transaction`* - Ready [@solana/web3.js](https://www.npmjs.com/package/@solana/web3.js) Transaction, got from `getUnStakeTransaction`.
- *`wallet`* - Wallet instance from [@solana/wallet-adapter-base](https://www.npmjs.com/package/@solana/wallet-adapter-base).
- *`setTxStage`* - Optional callback for getting information about transaction stage.

<br />

## Transaction info:

---

### getExchangeRate

_Returns exchange rate for stSOL-SOL_

- *`precision`* - how many decimals leave after . (`default = 4. Example: 1 stSOL = ~1.0485 SOL`)

### getTransactionCost

_Returns transaction cost for given instruction_

- *`instruction`* - INSTRUCTION code

### getStakingRewardsFee

_Returns staking rewards fee percent with it description_

### getTransactionInfo

_Returns above methods (`exchangeRate`, `transactionCost`, `stakingRewardsFee`) in one place_

- *`instruction`* - INSTRUCTION code

<img src={require('./assets/transactionInfo.png')} alt="Transaction Info" />

<br />

## Lido statistics:

---

### getTotalStaked

_Returns total staked SOL-s_

- *`precision`* - how many decimals leave after . (`default = 2. Example: 2,620,337.84 SOL`)

### getStakersCount

_Returns the number of non-empty stSOL accounts_

### getMarketCap

_Returns stSOL market cap in $_

- *`totalStakedInSol`* - total staked SOL-s


### getLidoStatistics

_Returns above methods (`totalStaked`, `stakersCount`, `marketCap`, also `apy`) in one place_

<img src={require('./assets/lidostatistics.png')} alt="Lido Statistics" />
