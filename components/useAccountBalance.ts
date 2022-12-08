import {useCallback, useMemo, useState, useEffect} from 'react';
import {LAMPORTS_PER_SOL, PublicKey} from '@solana/web3.js';
import {useConnection} from '@solana/wallet-adapter-react';
import useAuthorization from './useAuthorization';
import {TX_STAGE} from '@lidofinance/solido-sdk';

export default function useAccountBalance({sdk, stakeAmount, txStage}) {
  const {connection} = useConnection();
  const {selectedAccount} = useAuthorization();
  const [solBalanceLamports, setSolBalance] = useState(0);
  const [stSolBalanceLamports, setStSolBalance] = useState(0);

  const balanceFetcher = useCallback(
    async function (selectedPublicKey: PublicKey): Promise<number> {
      return await connection.getBalance(selectedPublicKey);
    },
    [connection],
  );

  useEffect(() => {
    if (!selectedAccount) {
      return;
    }

    const {publicKey} = selectedAccount;

    balanceFetcher(publicKey).then(balance => {
      setSolBalance(balance);
    });
    sdk.getStSolAccountsForUser(publicKey).then(account => {
      setStSolBalance(account[0].balanceInLamports);
    });
  }, [selectedAccount]);

  useEffect(() => {
    if (txStage !== TX_STAGE.SUCCESS || !stakeAmount) {
      return;
    }

    setSolBalance(balance => balance - stakeAmount * LAMPORTS_PER_SOL);
    setStSolBalance(balance => balance + stakeAmount * LAMPORTS_PER_SOL);
  }, [txStage, stakeAmount]);

  const balance = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {maximumFractionDigits: 4}).format(
        (solBalanceLamports || 0) / LAMPORTS_PER_SOL,
      ),
    [solBalanceLamports],
  );

  const stSolBalance = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {maximumFractionDigits: 4}).format(
        (stSolBalanceLamports || 0) / LAMPORTS_PER_SOL,
      ),
    [stSolBalanceLamports],
  );

  return {
    balance,
    stSolBalance,
  };
}
