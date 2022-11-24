import { getStakeApy, getMaxApy } from '@common/stakeApy';

import { getStakeApyMock, maxApy, mockedApyResponse } from '../mocks/getStakeApy';

describe('getStakeApy', () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  test('getMaxApy', () => {
    const actual = getMaxApy(mockedApyResponse.data);

    expect(actual).toStrictEqual(maxApy);
  });

  it('getStakeApy should return apy/complete response & also max', async () => {
    getStakeApyMock();

    const actual = await getStakeApy();

    expect(actual.max).toStrictEqual(maxApy);
    expect(actual).toStrictEqual({ max: maxApy, ...mockedApyResponse.data });
  });
});
