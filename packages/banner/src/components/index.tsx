import React from 'react';
import { ThemeProvider } from 'styled-components';
import { themeLight } from '@lidofinance/lido-ui';

import LidoStakeBanner, { Props } from './LidoStakeBanner';
import Font from './Font';

const Wrapper: React.FC<Props> = (props) => (
  <ThemeProvider theme={themeLight}>
    <Font />
    <LidoStakeBanner {...props} />
  </ThemeProvider>
);

Wrapper.defaultProps = {
  width: '335px',
};

export default Wrapper;
