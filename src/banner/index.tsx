import React from 'react';
import { Button, Box, Text, themeLight } from '@lidofinance/lido-ui';
import LidoLogo from '../assets/lido-logo.inline.svg';
import Background from '../assets/background.svg';
import { ThemeProvider } from 'styled-components';

type Props = {
  referrerId: number;
}

const LidoStakeBanner: React.FC<Props> = () => {
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
        color="#273852"
        fontFamily="Montserrat, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto"
        background={`url(${Background}) right center / cover`}
      >
        <Box>
          <LidoLogo />

          <Box mb={12} />

          <Text style={{fontSize: 36}} strong>
            5.71% APY + DeFi Yields
          </Text>
          <Text size="sm">
            Stake SOL with Lido and receive stSOL while staking. <br/>
            Put stSOL in to <strong>DeFI integrations</strong> and earn up to
            <strong>231.34% APY</strong>
          </Text>
        </Box>

        <Box display="flex" flexDirection="column">
          <Button color="secondary" size="lg">
            Stake SOL
          </Button>

          <Box mb={16} />

          <Button variant="outlined" color="secondary" size="lg">
            Explore 30+ integrations
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LidoStakeBanner;
