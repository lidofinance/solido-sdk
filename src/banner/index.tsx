import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { Button, Box, Text, themeLight, Link } from '@lidofinance/lido-ui';

import LidoLogo from '../assets/lido-logo.inline.svg';
import Background from '../assets/background.svg';
import BackgroundVertical from '../assets/background_vertical.svg';

import { getStakeApy, STATIC_DEFAULT_APY } from '../api/stakeApy';
import { getStakeLink, getDefiLink } from '../utils/getLinkWIthReferrer';

type Props = {
  referrerId: number;
  variant?: 'horizontal' | 'vertical';
}

const LidoStakeBanner: React.FC<Props> = (props) => {
  const {referrerId, variant = 'horizontal'} = props;
  const stakeLink = getStakeLink(referrerId);
  const defiLink = getDefiLink(referrerId);

  const [apy, setApy] = useState(STATIC_DEFAULT_APY);

  useEffect(() => {
    getStakeApy()
      .then((apy) => {
        setApy(apy)
      });
  });

  return (
    <ThemeProvider theme={themeLight}>
      <style>{`
          @import url(https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700);
      `}</style>
      <Box
        px={60}
        py={40}
        display="flex"
        justifyContent="space-between"
        borderRadius={10}
        color={themeLight.colors.secondary}
        fontFamily="Montserrat, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto"
        background={`url(${Background}) right center / cover`}
      >
        <Box>
          <LidoLogo />

          <Box mb={12} />

          <Text style={{fontSize: 36}} strong>
            {`${apy} APY + DeFi Yields`}
          </Text>
          <Text size="sm">
            Stake SOL with Lido and receive stSOL while staking. <br/>
            Put stSOL in to <strong>DeFI integrations</strong> and earn up to <strong>231.34% APY</strong>
          </Text>
        </Box>

        <Box display="flex" flexDirection="column" width={294}>
          <Link href={stakeLink}>
            <Button color="secondary" size="lg" fullwidth>
              Stake SOL
            </Button>
          </Link>

          <Box mb={16} />

          <Link href={defiLink}>
            <Button variant="outlined" color="secondary" size="lg" fullwidth>
              Explore 30+ integrations
            </Button>
          </Link>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LidoStakeBanner;
