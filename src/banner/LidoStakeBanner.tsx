import React, { useEffect, useState } from 'react';
import { Button, Box, Text, themeLight, Link, useBreakpoint } from '@lidofinance/lido-ui';

import LidoLogo from '../assets/lido-logo.inline.svg';
import Background from '../assets/background.svg';
import BackgroundVertical from '../assets/background_vertical.svg';

import { getStakeApy, STATIC_DEFAULT_APY } from '../api/stakeApy';
import { getStakeLink, getDefiLink } from '../utils/getLinkWIthReferrer';

export type Props = {
  referrerId: number;
  direction: 'horizontal';
} | {
  referrerId: number;
  direction: 'vertical';
  width?: string;
}

const LidoStakeBanner: React.FC<Props> = (props) => {
  const {referrerId, direction} = props;
  const stakeLink = getStakeLink(referrerId);
  const defiLink = getDefiLink(referrerId);

  const [apy, setApy] = useState(STATIC_DEFAULT_APY);
  const [width, setWidth] = useState('100%');

  const isMobile = useBreakpoint('lg');
  const isVertical = isMobile || direction === 'vertical';

  useEffect(() => {
    if (direction === 'vertical') {
      setWidth(props.width || '335px') // TODO, constants
    }
  }, [direction]);

  useEffect(() => {
    getStakeApy()
      .then((apy) => {
        setApy(apy)
      });
  }, []);

  const background = isVertical
    ? `url(${BackgroundVertical}) center bottom / cover`
    : `url(${Background}) right center / cover`;

  return (
    <>
      <style>{`
          @import url(https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700);
      `}</style>
      <Box
        px={isVertical ? 30 : 60}
        py={40}
        display="flex"
        flexDirection={isVertical ? 'column' : 'row'}
        justifyContent="space-between"
        borderRadius={10}
        color={themeLight.colors.secondary}
        fontFamily="Montserrat, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto"
        background={background}
        maxWidth={width}
        style={{ boxSizing: 'border-box' }}
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

        {isVertical && <Box mb={20} />}

        <Box display="flex" flexDirection="column" width={isVertical ? '100%' : 294}>
          <Link href={stakeLink}>
            <Button color="secondary" size="lg" fullwidth square>
              Stake SOL
            </Button>
          </Link>

          <Box mb={16} />

          <Link href={defiLink}>
            <Button variant="outlined" color="secondary" size="lg" fullwidth square>
              Explore 30+ integrations
            </Button>
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default LidoStakeBanner;
