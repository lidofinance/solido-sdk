import styled from 'styled-components';
import { Box } from '@lidofinance/lido-ui';

import { fontFamily } from './Font';

export const BannerWrapper = styled(Box)<{isVertical: boolean}>`
  display: flex;
  flex-direction: ${({ isVertical }) => isVertical ? 'column' : 'row'};
  justify-content: space-between;
  padding: 40px ${({ isVertical }) => isVertical ? 30 : 60}px;
  color: ${({ theme }) => theme.colors.secondary};
  box-sizing: border-box;
  border-radius: 10px;
  font-family: ${fontFamily};

  @media screen and (max-width: 920px) {
    padding: 40px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 30px 40px;
  }
`;
