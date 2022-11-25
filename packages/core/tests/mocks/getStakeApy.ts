export const mockedApyResponse = {
  data: {
    twoWeeks: {
      apy: 9.353782791852217,
      apr: 8.944427543232194,
      intervalPrices: {
        beginEpoch: 370,
        endEpoch: 376,
      },
    },
    oneMonth: {
      apy: 8.08104914304506,
      apr: 7.7730450755087315,
      intervalPrices: {
        beginEpoch: 363,
        endEpoch: 376,
      },
    },
    threeMonth: {
      apy: 6.616660474389802,
      apr: 6.408413650257713,
      intervalPrices: {
        beginEpoch: 341,
        endEpoch: 376,
      },
    },
    sinceLaunch: {
      apy: 5.806421229000747,
      apr: 5.645341685716368,
      intervalPrices: {
        beginEpoch: 221,
        endEpoch: 376,
      },
    },
    lastEpoch: {
      apy: 8.195316714634648,
      apr: 7.878695988804403,
      intervalPrices: {
        beginEpoch: 375,
        endEpoch: 376,
      },
    },
  },
};

export const maxApy = mockedApyResponse.data.twoWeeks.apy;

export const getStakeApyMock = (error?: boolean) => {
  jest.spyOn(global, 'fetch').mockReturnValueOnce(
    // @ts-ignore
    Promise.resolve({
      json: () => Promise.resolve(error ? null : mockedApyResponse),
    }),
  );
};
