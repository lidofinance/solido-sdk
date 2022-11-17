# Lido on Solana - Frontend SDK

### About us

Lido on Solana is a Lido-DAO governed liquid staking protocol for the Solana blockchain. Anyone who stakes their SOL tokens with Lido will be issued an on-chain representation of SOL staking position with Lido validators, called <strong>stSOL</strong>. We will work to integrate stSOL widely into the Solana DeFi ecosystem to enable stSOL users to make use of their staked assets in a variety of applications.

Lido on Solana gives you:
- **Liquidity** — No delegation/activation delays and the ability to sell your staked tokens
- **One-click staking** — No complicated steps
- **Decentralized** security — Assets spread across the industry’s leading validators chosen by the Lido DAO

### About sdk

This sdk helps you integrate with us, using two ways:
1. Simplest way is using React banner.
2. Support UI widget in your project. We provide js functions for staking, unstaking, statistics and transaction info.
3. Use staking widget with UI (coming soon)

## Contents:
- [Using banner](#using-banner)
- [Using SDK](#using-sdk)
- [Using staking widget](#using-staking-widget)
- [Learn more](#learn-more)

## Installation
```bash
$ npm install @lidofinance/solido-sdk
$ yarn add @lidofinance/solido-sdk
```

## Using banner

#### Installation
```bash
$ npm install @lidofinance/solido-sdk-banner
$ yarn add @lidofinance/solido-sdk-banner
```

<img src="packages/banner/src/assets/banner_horizontal.png" alt="Banner" />

```ts
import LidoStakeBanner from '@lidofinance/solido-sdk-banner';

<LidoStakeBanner referrerId="your_solana_referral_address" direction="horizontal" />
```

_Note: also available vertical mode. [Read more](https://lidofinance.github.io/solido-sdk/banner)_

## Using SDK

#### Installation
```bash
$ npm install @lidofinance/solido-sdk
$ yarn add @lidofinance/solido-sdk
```

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

## Using staking widget

In progress, will be available soon.

## Learn more
- [Lido on Solana](https://solana.lido.fi/)
- [Docs](https://docs.solana.lido.fi/)
- [Lido Referral Program for Solana](https://help.lido.fi/en/articles/5847184-lido-referral-program-for-solana-integration-guide)
- [Join on Discord](https://discord.gg/vgdPfhZ)
- [Discord Support Channel](https://discord.com/channels/761182643269795850/1008674036508790784)
