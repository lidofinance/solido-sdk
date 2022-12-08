import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {Buffer} from 'buffer';
global.Buffer = global.Buffer || Buffer;

import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SolidoSDK} from '@lidofinance/solido-sdk';
import {Connection} from '@solana/web3.js';
import {ConnectionProvider} from '@solana/wallet-adapter-react';
import {
  Appbar,
  Provider as PaperProvider,
  Portal,
  Text,
  Card,
  Paragraph,
  Divider,
  TextInput,
} from 'react-native-paper';

import ConnectButton from './components/ConnectButton';
import useAuthorization from './components/useAuthorization';
import useAccountBalance from './components/useAccountBalance';
import StakeButton from './components/StakeButton';

const styles = StyleSheet.create({
  sectionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const Section = ({label, value}): Node => {
  return (
    <View style={styles.sectionContainer}>
      <Text variant="bodyMedium" style={{color: '#273852'}}>
        {label}
      </Text>
      <Text variant="bodyMedium" style={{color: '#273852'}}>
        {value}
      </Text>
    </View>
  );
};

const rpcEndpoint =
  'https://pyth-testnet-rpc-1.solana.p2p.org/yIwMoknPihQvrhSyxafcHvsAqkOE7KKrBUpplM5Xf';

const connection = new Connection(rpcEndpoint);
const sdk = new SolidoSDK('testnet', connection);

const App: () => Node = () => {
  const [lidoStats, setLidoStats] = useState({});
  const {selectedAccount} = useAuthorization();
  const {balance, stSolBalance} = useAccountBalance(sdk);

  // useEffect(() => {
  // sdk.getLidoStatistics().then(sc => {
  //   setLidoStats(sc);
  // });
  // }, []);

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
    height: '100%',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Appbar.Header
        mode="center-aligned"
        elevated
        style={{backgroundColor: Colors.lighter}}>
        <Appbar.Content color="#273852" title="Lido on Solana" />
      </Appbar.Header>

      <Portal.Host>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <View style={{backgroundColor: Colors.white, padding: 12}}>
            <Text
              variant="headlineLarge"
              style={{
                fontWeight: '800',
                textAlign: 'center',
                paddingTop: 12,
                color: '#273852',
              }}>
              Stake Solana
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                textAlign: 'center',
                color: '#7a8aa0',
                marginBottom: 24,
              }}>
              Stake SOL and receive stSOL while staking
            </Text>

            <Card style={{padding: 12}}>
              <Card.Content>
                <Text variant="bodyMedium">SOL Balance</Text>
                <Paragraph>
                  <Text variant="titleLarge" style={{fontWeight: '900'}}>
                    {balance} SOL
                  </Text>
                </Paragraph>

                <Divider style={{marginBottom: 12, marginTop: 6}} />

                <Text variant="bodyMedium">stSOL Balance</Text>
                <Paragraph>
                  <Text variant="titleLarge" style={{fontWeight: '900'}}>
                    {stSolBalance} stSOL
                  </Text>
                </Paragraph>
              </Card.Content>

              <Card
                style={{
                  margin: -13,
                  marginTop: 12,
                  backgroundColor: '#fff',
                  padding: 12,
                }}>
                <Card.Content>
                  <TextInput
                    mode="outlined"
                    label="Stake amount"
                    outlineColor="#d1d8df"
                    textColor="#273852"
                    activeOutlineColor="#00a3ff"
                    style={{backgroundColor: '#fff', marginBottom: 12}}
                  />

                  {selectedAccount ? (
                    <StakeButton sdk={sdk} />
                  ) : (
                    <ConnectButton />
                  )}

                  <View style={{marginTop: 24}}>
                    <Section label="You will receive:" value="~0.9202 stSOL" />
                    <Section
                      label="Exchange rate:"
                      value="1 SOL = ~0.9202 stSOL"
                    />
                    <Section
                      label="Transaction cost:"
                      value="~0.000005 SOL ($0.00006)"
                    />
                    <Section label="Staking rewards fee:" value="10%" />
                  </View>
                </Card.Content>
              </Card>
            </Card>

            <Text
              variant="titleLarge"
              style={{
                fontWeight: '800',
                paddingTop: 24,
                color: '#273852',
              }}>
              Lido statistics
            </Text>
            <Card style={{padding: 12, marginTop: 12, backgroundColor: '#fff'}}>
              <Card.Content>
                <Section label="Annual percentage yield:" value="8.72%" />
                <Section label="Total staked with Lido:" value="42 SOL" />
                <Section label="Stakers" value="12" />
                <Section label="MarketCap:" value="$570" />
                {/*<Text variant="bodyMedium" style={{color: '#273852'}}>*/}
                {/*  Annual percentage yield: {lidoStats.apy?.toFixed(2) ?? 0}%*/}
                {/*</Text>*/}
                {/*<Text variant="bodyMedium" style={{color: '#273852'}}>*/}
                {/*  Stakes count: {lidoStats.stakers?.formatted ?? 0}*/}
                {/*</Text>*/}
                {/*<Text variant="bodyMedium" style={{color: '#273852'}}>*/}
                {/*  Total staked with Lido:{' '}*/}
                {/*  {lidoStats.totalStaked?.formatted ?? 0}*/}
                {/*</Text>*/}
                {/*<Text variant="bodyMedium" style={{color: '#273852'}}>*/}
                {/*  MarketCap: {lidoStats.marketCap ?? 0}*/}
                {/*</Text>*/}
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </Portal.Host>
    </SafeAreaView>
  );
};

export default () => {
  return (
    <PaperProvider>
      <ConnectionProvider endpoint={rpcEndpoint}>
        <App />
      </ConnectionProvider>
    </PaperProvider>
  );
};
