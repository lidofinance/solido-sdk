import { ErrorWrapper } from './errorWrapper';
import { SOL_API_HOST, ERROR_CODE } from './constants';

export const STATIC_DEFAULT_APY = 9.35; // TODO think

const { NO_APY_DATA } = ERROR_CODE;

type ApyData = {
  apy: number;
  apr: number;
  intervalPrices: {
    beginEpoch: number;
    endEpoch: number;
  };
};

type StakeApyResponse = {
  data: {
    lastEpoch: ApyData;
    twoWeeks: ApyData;
    oneMonth: ApyData;
    threeMonth: ApyData;
    sinceLaunch: ApyData;
  };
};

export const getMaxApy = (data: StakeApyResponse['data']) => {
  return Object.values(data).reduce((max, curr) => {
    if (max.apy < curr.apy) {
      return curr;
    }

    return max;
  });
};

export const getStakeApy = async (): Promise<StakeApyResponse['data'] & { max: ApyData }> => {
  return fetch(`${SOL_API_HOST}/v1/apy/complete`, { mode: 'cors' })
    .then<StakeApyResponse>((res) => res.json())
    .then(({ data }) => ({
      max: getMaxApy(data),
      ...data,
    }))
    .catch((error) => {
      throw new ErrorWrapper({ error, code: NO_APY_DATA });
    });
};
