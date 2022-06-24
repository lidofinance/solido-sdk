import React, { useEffect, useState } from 'react';
import { Button, Box, Text, Link, useBreakpoint } from '@lidofinance/lido-ui';

import LidoLogo from '@/assets/lido-logo.inline.svg';
import Background from '@/assets/background.svg';
import BackgroundVertical from '@/assets/background_vertical.svg';

import { getStakeApy, STATIC_DEFAULT_APY } from '@/api/stakeApy';
import { getDefiApy } from '@/api/defiApy';
import { getStakeLink, getDefiLink } from '@/utils/getLinkWIthReferrer';
import { BannerWrapper } from './styles';

export type Props = {
  /**
   * Solana Referral Address, example 6She3Tz55nCFhkMzfrGZ194KrtJb6MapnWpK2fDfSbDM.
   * Read more here https://help.lido.fi/en/articles/5847184-lido-referral-program-for-solana-integration-guide
   */
  referrerId: string;
  direction: 'horizontal';
} | {
  referrerId: string;
  direction: 'vertical';
  /**
   * This option is for customizing width of vertical banner. Default and best fit value is 335px.
   * For horizontal mode always 100%, use wrapper, if need limited.
   */
  width: string;
}

const LidoStakeBanner: React.FC<Props> = (props) => {
  const {referrerId, direction} = props;

  const stakeLink = getStakeLink(referrerId);
  const defiLink = getDefiLink(referrerId);
  const defiApy = getDefiApy();

  const [apy, setApy] = useState(STATIC_DEFAULT_APY);
  const [width, setWidth] = useState('100%');

  const isMobile = useBreakpoint('lg');
  const isVertical = isMobile || direction === 'vertical';

  useEffect(() => {
    if (direction === 'vertical') {
      setWidth(props.width);
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
    <BannerWrapper
      background={background}
      maxWidth={width}
      isVertical={isVertical}
    >
      <Box mr={isVertical ? 0 : 8}>
        <LidoLogo />

        <Box mb={12} />

        <Text style={{fontSize: 36, lineHeight: '50px'}} strong>
          {`${apy} APY + DeFi Yields`}
        </Text>
        <Text size="sm" style={{lineHeight: '26px'}}>
          Stake SOL with Lido and receive stSOL while staking. <br/>
          Put stSOL in to <strong>DeFI integrations</strong> and earn up to <strong>{defiApy}% APY</strong>
        </Text>
      </Box>

      {isVertical && <Box mb={20} />}

      <Box display="flex" flexDirection="column" justifyContent="center" width={isVertical ? '100%' : 294}>
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
    </BannerWrapper>
  );
};

export default LidoStakeBanner;
