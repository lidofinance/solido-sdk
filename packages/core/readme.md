# Lido on Solana - Frontend SDK

### About us

Lido on Solana is a Lido-DAO governed liquid staking protocol for the Solana blockchain. Anyone who stakes their SOL tokens with Lido will be issued an on-chain representation of SOL staking position with Lido validators, called <strong>stSOL</strong>. We will work to integrate stSOL widely into the Solana DeFi ecosystem to enable stSOL users to make use of their staked assets in a variety of applications.

Lido on Solana gives you:
- **Liquidity** — No delegation/activation delays and the ability to sell your staked tokens
- **One-click staking** — No complicated steps
- **Decentralized** security — Assets spread across the industry’s leading validators chosen by the Lido DAO

### About sdk

Here we provide js functions for staking, unstaking, statistics and transaction info.

## Contents:
- [Installation](#installation)
- [How to use](#how-to-use)
- [Learn more](#learn-more)

## Installation
```bash
$ npm install @lidofinance/solido-sdk
$ yarn add @lidofinance/solido-sdk
```

## How to use

Staking:

```ts
import { SolidoSDK } from '@lidofinance/solido-sdk';
// solana/web3.js Connection
const solidoSDK = new SolidoSDK('mainnet-beta', connection, 'your_solana_referral_address');

try {
  const { transactionHash, stSolAccountAddress } = await solidoSDK.stake({
    amount: 20, // The amount of SOL-s which need to stake
    wallet: wallet, // Wallet instance
    setTxStage: setTxStageCallback, // Optional callback for getting information about transaction stage (see TX_STAGE)
  });
} catch (e) {
  // Handle Errors
}
```

_[Read more for full examples & details](https://docs.solana.lido.fi/frontend-integration/sdk)_

## Learn more
- [Lido on Solana](https://solana.lido.fi/)
- [Docs](https://docs.solana.lido.fi/frontend-integration/sdk)
- [Lido Referral Program for Solana](https://help.lido.fi/en/articles/5847184-lido-referral-program-for-solana-integration-guide)
- [Join on Discord](https://discord.gg/vgdPfhZ)
- [Discord Support Channel](https://discord.com/channels/761182643269795850/1008674036508790784)
