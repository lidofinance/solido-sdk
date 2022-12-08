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
import {SolidoSDK, getStakeApy} from '@lidofinance/solido-sdk';
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
  const [lidoStats, setLidoStats] = useState({
    apy: 8.72,
    totalStaked: 0,
    stakers: 0,
    marketCap: 0,
  });
  const [transactionInfo, setTransactionInfo] = useState({
    exchangeRate: 1,
    transactionCost: {
      costInSol: 0.000005,
      costInUsd: 0.00006,
    },
    stakingRewardsFee: '10%',
  });
  const {selectedAccount} = useAuthorization();
  const {balance, stSolBalance} = useAccountBalance(sdk);

  useEffect(() => {
    getStakeApy().then(({max}) => {
      setLidoStats(prevState => ({
        ...prevState,
        apy: max.apy,
      }));
    });

    sdk.getTransactionInfo(1).then(txInfo => {
      setTransactionInfo({
        ...txInfo,
        exchangeRate: txInfo.exchangeRate.value,
        stakingRewardsFee: txInfo.stakingRewardsFee.fee,
      });
    });

    sdk.getStakersCount().then(({value: stakers}) => {
      setLidoStats(prevState => ({...prevState, stakers}));
    });

    sdk.getTotalStaked().then(totalStaked => {
      sdk.getMarketCap(totalStaked).then(marketCap => {
        setLidoStats(prevState => ({
          ...prevState,
          totalStaked,
          marketCap,
        }));
      });
    });
  }, []);

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
                    <Section
                      label="You will receive:"
                      value={`~${transactionInfo.exchangeRate} stSOL`}
                    />
                    <Section
                      label="Exchange rate:"
                      value={`1 SOL = ${transactionInfo.exchangeRate} stSOL`}
                    />
                    <Section
                      label="Transaction cost:"
                      value={`~${transactionInfo.transactionCost.costInSol} SOL ($${transactionInfo.transactionCost.costInUsd})`}
                    />
                    <Section
                      label="Staking rewards fee:"
                      value={transactionInfo.stakingRewardsFee}
                    />
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
                <Section
                  label="Annual percentage yield:"
                  value={`${lidoStats.apy.toFixed(2)}%`}
                />
                <Section
                  label="Total staked with Lido:"
                  value={`${lidoStats.totalStaked} SOL`}
                />
                <Section label="Stakers" value={lidoStats.stakers} />
                <Section label="MarketCap:" value={`$${lidoStats.marketCap}`} />
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
