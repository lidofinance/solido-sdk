import {useCallback, useMemo, useState, useEffect} from 'react';
import {LAMPORTS_PER_SOL, PublicKey} from '@solana/web3.js';
import {useConnection} from '@solana/wallet-adapter-react';
import useAuthorization from './useAuthorization';

export default function useAccountBalance(sdk) {
  const {connection} = useConnection();
  const {selectedAccount} = useAuthorization();
  const [solBalance, setSolBalance] = useState(0);
  const [stSolAccount, setStSolAccount] = useState(null);

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
      setStSolAccount(account[0]);
    });
  }, [selectedAccount]);

  const balance = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {maximumFractionDigits: 4}).format(
        (solBalance || 0) / LAMPORTS_PER_SOL,
      ),
    [solBalance],
  );

  const stSolBalance = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {maximumFractionDigits: 4}).format(
        (stSolAccount?.balanceInLamports || 0) / LAMPORTS_PER_SOL,
      ),
    [stSolAccount?.balanceInLamports],
  );

  return {
    balance,
    stSolBalance,
  };
}
