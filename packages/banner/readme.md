# Lido on Solana - Frontend SDK, Banner integration

### About us

Lido on Solana is a Lido-DAO governed liquid staking protocol for the Solana blockchain. Anyone who stakes their SOL tokens with Lido will be issued an on-chain representation of SOL staking position with Lido validators, called <strong>stSOL</strong>. We will work to integrate stSOL widely into the Solana DeFi ecosystem to enable stSOL users to make use of their staked assets in a variety of applications.

Lido on Solana gives you:
- **Liquidity** — No delegation/activation delays and the ability to sell your staked tokens
- **One-click staking** — No complicated steps
- **Decentralized** security — Assets spread across the industry’s leading validators chosen by the Lido DAO

## Contents:
- [Installation](#installation)
- [How to use](#how-to-use)
- [Learn more](#learn-more)

## Installation
```bash
$ npm install @lidofinance/solido-sdk-banner
$ yarn add @lidofinance/solido-sdk-banner
```

## How to use

<img src="packages/banner/src/assets/banner_horizontal.png" alt="Banner" />

```ts
import LidoStakeBanner from '@lidofinance/solido-sdk-banner';

<LidoStakeBanner referrerId="your_solana_referral_address" direction="horizontal" />
```

#### Props:
- *`referrerId`* - Solana Referral Address. [Read more](https://help.lido.fi/en/articles/5847184-lido-referral-program-for-solana-integration-guide).
- *`width?`* - This option is for customising width of vertical mode. Default and best fit value is `335px`.
- *`direction`* = *`horizontal|vertical`*

[Read more](https://docs.solana.lido.fi/frontend-integration/sdk/banner)_

## Learn more
- [Lido on Solana](https://solana.lido.fi/)
- [Docs](https://docs.solana.lido.fi/frontend-integration/sdk)
- [Lido Referral Program for Solana](https://help.lido.fi/en/articles/5847184-lido-referral-program-for-solana-integration-guide)
- [Join on Discord](https://discord.gg/vgdPfhZ)
- [Discord Support Channel](https://discord.com/channels/761182643269795850/1008674036508790784)
