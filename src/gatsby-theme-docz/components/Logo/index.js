import React from 'react'
import StsolLogo from '@/assets/logo.inline.svg';
import { Box } from '@lidofinance/lido-ui';

export const Logo = () => (
  <Box display="flex" alignItems="center">
    <StsolLogo />

    <Box ml={10} />

    Lido on Solana - Frontend SDK
  </Box>
);
