# Example Lido on Solana mobile

----

This demonstrates how you can use the `solido-sdk` in a React Native app.

https://user-images.githubusercontent.com/99960252/208771257-9d2e9746-75a9-41cd-9aa5-e56baf4beb15.mp4

## Features

- Connect Solana Mobile Wallet
  - SOL balance
  - stSOL balance
- Stake stSOL using [getStakeTransaction()](https://docs.solana.lido.fi/frontend-integration/sdk/sdk-methods#getstaketransaction)
- Showing [lido statistics](https://docs.solana.lido.fi/frontend-integration/sdk/sdk-methods#getlidostatistics)
- Showing [transaction info](https://docs.solana.lido.fi/frontend-integration/sdk/sdk-methods#transaction-info)


## Prerequisites

This example is working only on Android, because [Solana Mobile Wallet Adapter](https://github.com/solana-mobile/mobile-wallet-adapter) doesn't support IOS yet.

1. Set up the Android development environment by following the [environment setup instructions](https://reactnative.dev/docs/environment-setup) for your OS.
2. Install at least one mobile wallet adapter compliant wallet app on your device/simulator.

**Note:** _The example is running on **testnet**, it's important to switch to testnet network on mobile wallet adapter, before start._

## Start

1. Install dependencies and build the client libraries locally with `npm i`.
2. Start the React Native packager, build the application, and start the simulator with `npm run android`.


Feel free to ask any questions if you get stuck: [Discord: solana-dev-support](https://discord.com/channels/761182643269795850/1008674036508790784)

Read more about [How to run sdk in react-native.](https://lidofinance.github.io/solana-docs-preview/frontend-integration/sdk/react-native)

