import React, {useCallback} from 'react';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useConnection} from '@solana/wallet-adapter-react';
import {Button} from 'react-native-paper';
import {SolidoSDK, TX_STAGE} from '@lidofinance/solido-sdk';
import useAuthorization from './useAuthorization';

export default function StakeButton({
  sdk,
  stakeAmount,
  setTxStage,
  setTxModalVisible,
  disabled,
}: {
  sdk: SolidoSDK;
  stakeAmount: number;
  setTxStage;
  setTxModalVisible;
  disabled: boolean;
}) {
  const {connection} = useConnection();
  const {authorizeSession, selectedAccount} = useAuthorization();

  const handleStakePress = useCallback(async () => {
    if (!stakeAmount) {
      return;
    }

    setTxModalVisible(true);

    try {
      const {transaction} = await sdk.getStakeTransaction({
        amount: stakeAmount,
        payerAddress: selectedAccount?.publicKey,
      });

      setTxStage({stage: TX_STAGE.AWAITING_SIGNING});

      const signed = await transact(async wallet => {
        await authorizeSession(wallet);

        const [signed] = await wallet.signTransactions({
          transactions: [transaction],
        });

        return signed;
      });

      const transactionHash = await connection.sendRawTransaction(
        signed.serialize(),
      );

      setTxStage({stage: TX_STAGE.AWAITING_BLOCK, transactionHash});

      const {blockhash, lastValidBlockHeight} =
        await connection.getLatestBlockhash();

      const {value: status} = await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature: transactionHash,
      });

      if (status?.err) {
        setTxStage({stage: TX_STAGE.ERROR, transactionHash});
        throw status.err;
      }

      setTxStage({stage: TX_STAGE.SUCCESS, transactionHash});
    } catch (e) {
      console.log(e);
      setTxStage({stage: TX_STAGE.ERROR});
    }
  }, [selectedAccount, stakeAmount, sdk]);

  return (
    <Button
      mode="contained"
      textColor="#fff"
      buttonColor="#00a3ff"
      style={{borderRadius: 5}}
      disabled={disabled}
      onPress={handleStakePress}>
      Stake
    </Button>
  );
}
