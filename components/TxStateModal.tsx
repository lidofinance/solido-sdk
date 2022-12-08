import React from 'react';
import {ActivityIndicator, Modal, Portal, Text} from 'react-native-paper';
import {TX_STAGE} from '@lidofinance/solido-sdk';

import CheckRoundSvg from './CheckRoundSvg';
import CrossRoundSvg from './CrossRoundSvg';
import Link from './Link';

const TxStateModal = ({
  transactionHash,
  amount,
  stage,
  visible,
  setTxModalVisible,
}) => {
  const hideModal = () => setTxModalVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    margin: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  };
  const modalTextStyle = {color: '#273852', marginTop: 24, marginBottom: 24};

  const loader = (
    <ActivityIndicator
      animating
      color="blue"
      size="large"
      style={{width: 80, height: 80}}
    />
  );

  let header = '';
  switch (stage) {
    case TX_STAGE.AWAITING_SIGNING:
      header = (
        <>
          {loader}
          <Text variant="titleMedium" style={modalTextStyle}>
            Confirm this transaction in your wallet
          </Text>
        </>
      );
      break;

    case TX_STAGE.AWAITING_BLOCK:
      header = (
        <>
          {loader}
          <Text variant="titleMedium" style={modalTextStyle}>
            Transaction Approved. Waiting for transaction to be confirmed on the
            blockchain (MAX confirmation = ~32)
          </Text>
        </>
      );
      break;

    case TX_STAGE.SUCCESS:
      header = (
        <>
          <CheckRoundSvg />

          <Text variant="titleMedium" style={modalTextStyle}>
            {amount} SOL Successfully Staked
          </Text>
        </>
      );
      break;

    case TX_STAGE.ERROR:
      header = (
        <>
          <CrossRoundSvg />

          <Text variant="titleMedium" style={{...modalTextStyle, color: 'red'}}>
            Something went wrong
          </Text>
        </>
      );
      break;

    default:
      header = (
        <>
          {loader}
          <Text variant="titleMedium" style={modalTextStyle}>
            Awaiting...
          </Text>
        </>
      );
      break;
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={stage !== TX_STAGE.ERROR || stage !== TX_STAGE.SUCCESS}
        handleDismiss={hideModal}
        contentContainerStyle={containerStyle}>
        {header}

        <Link
          variant="titleMedium"
          href={`https://explorer.solana.com/tx/${transactionHash}?cluster=testnet`}>
          View on Block Explorer
        </Link>
      </Modal>
    </Portal>
  );
};

export default TxStateModal;
