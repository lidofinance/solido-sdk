import React from 'react';
import { Button, Link } from '@lidofinance/lido-ui';
import LidoLogo from './assets/lido-logo_black.svg';

type Props = {
  referrerId: number;
}

const LidoStakeBanner: React.FC = () => {
  return (
    <>
      <img src={LidoLogo} title="lido-logo"  alt="" />
    </>
  );
};

export default LidoStakeBanner;
