import React, {useCallback} from 'react';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useConnection} from '@solana/wallet-adapter-react';
import {Button} from 'react-native-paper';
import {SolidoSDK, TX_STAGE} from '@lidofinance/solido-sdk';
import useAuthorization from './useAuthorization';

export default function StakeButton({
  sdk,
  setTxStage,
  setTxModalVisible,
}: {
  sdk: SolidoSDK;
  setTxStage;
  setTxModalVisible;
}) {
  const {connection} = useConnection();
  const {authorizeSession, selectedAccount} = useAuthorization();

  const handleStakePress = useCallback(async () => {
    setTxModalVisible(true);

    await transact(async wallet => {
      const freshAccount = await authorizeSession(wallet);
      const {transaction} = await sdk.getStakeTransaction({
        amount: 1,
        payerAddress: freshAccount?.publicKey,
      });

      setTxStage({stage: TX_STAGE.AWAITING_SIGNING});

      const [signed] = await wallet.signTransactions({
        transactions: [transaction],
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
    });
  }, [selectedAccount, sdk]);

  return (
    <Button
      mode="contained"
      textColor="#fff"
      buttonColor="#00a3ff"
      style={{borderRadius: 5}}
      onPress={handleStakePress}>
      Stake
    </Button>
  );
}
