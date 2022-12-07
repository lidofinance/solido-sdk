import React, {useCallback, useEffect, useState} from 'react';
import type {Node} from 'react';
import {Buffer} from 'buffer';
global.Buffer = global.Buffer || Buffer;

import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import {SolidoSDK} from '@lidofinance/solido-sdk';
import {Connection} from '@solana/web3.js';
import {ConnectionProvider} from '@solana/wallet-adapter-react';
import ConnectButton from './components/ConnectButton';
import AccountBalance from './components/AccountBalance';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import useAuthorization from './components/useAuthorization';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
const Section = ({children, title}): Node => {
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: Colors.dark,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const rpcEndpoint =
  'https://pyth-testnet-rpc-1.solana.p2p.org/yIwMoknPihQvrhSyxafcHvsAqkOE7KKrBUpplM5Xf';

const App: () => Node = () => {
  const connection = new Connection(rpcEndpoint);
  const sdk = new SolidoSDK('testnet', connection);
  const [lidoStats, setLidoStats] = useState({});
  const {authorizeSession, selectedAccount} = useAuthorization();

  // useEffect(() => {
  // sdk.getLidoStatistics().then(sc => {
  //   setLidoStats(sc);
  // });
  // }, []);

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };

  const handleStakePress = useCallback(async () => {
    await transact(async wallet => {
      const freshAccount = await authorizeSession(wallet);
      const {transaction} = await sdk.getStakeTransaction({
        amount: 1,
        payerAddress: freshAccount?.publicKey,
      });

      const [signed] = await wallet.signTransactions({
        transactions: [transaction],
      });

      const transactionHash = await connection.sendRawTransaction(
        signed.serialize(),
      );

      const {blockhash, lastValidBlockHeight} =
        await connection.getLatestBlockhash();

      const {value: status} = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature: transactionHash,
      });

      if (status?.err) {
        throw status.err;
      }
    });
  }, [selectedAccount]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View style={{backgroundColor: Colors.white}}>
          <Section title="Solido SDK: testnet">
            <Text>
              Apy: {lidoStats.apy?.toFixed(2) ?? 0}%{'\n'}
            </Text>
            <Text>
              Stakes count: {lidoStats.stakers?.formatted ?? 0}
              {'\n'}
            </Text>
            <Text>
              Total staked: {lidoStats.totalStaked?.formatted ?? 0}
              {'\n'}
            </Text>
            <Text>MarketCap: {lidoStats.marketCap ?? 0}</Text>
          </Section>

          <ConnectionProvider endpoint={rpcEndpoint}>
            <Section title="Balance:">
              <AccountBalance sdk={sdk} />
            </Section>

            <ConnectButton title="Connect Wallet" />
            <Text>{'\n'}</Text>
            <Button title="Stake" onPress={handleStakePress} />
          </ConnectionProvider>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 12,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
