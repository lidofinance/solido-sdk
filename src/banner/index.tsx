import React from 'react';
import { ThemeProvider } from 'styled-components';
import { themeLight } from '@lidofinance/lido-ui';

import LidoStakeBanner, { Props } from './LidoStakeBanner';

const Wrapper: React.FC<Props> = (props) => {
  return (
    <ThemeProvider theme={themeLight}>
      <LidoStakeBanner {...props} />
    </ThemeProvider>
  )
}

export default Wrapper;
