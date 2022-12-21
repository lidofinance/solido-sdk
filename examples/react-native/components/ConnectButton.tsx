import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol';
import React, {useCallback, useState} from 'react';
import {Button} from 'react-native-paper';

import useAuthorization from './useAuthorization';

export default function ConnectButton() {
  const {authorizeSession} = useAuthorization();
  const [authorizationInProgress, setAuthorizationInProgress] = useState(false);

  const handleConnectPress = useCallback(async () => {
    try {
      if (authorizationInProgress) {
        return;
      }
      setAuthorizationInProgress(true);
      await transact(async wallet => {
        await authorizeSession(wallet);
      });
    } finally {
      setAuthorizationInProgress(false);
    }
  }, []);

  return (
    <Button
      mode="contained"
      textColor="#fff"
      buttonColor="#00a3ff"
      style={{borderRadius: 5}}
      disabled={authorizationInProgress}
      loading={authorizationInProgress}
      onPress={handleConnectPress}>
      Connect Wallet
    </Button>
  );
}
