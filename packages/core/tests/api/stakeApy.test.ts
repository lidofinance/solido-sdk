import { getStakeApy, getMaxApy } from '@common/stakeApy';
import { ERROR_CODE, ERROR_CODE_DESC, ERROR_MESSAGE } from '@common/constants';

import { getStakeApyMock, maxApy, mockedApyResponse } from '../mocks/getStakeApy';

describe('getStakeApy', () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  test('getMaxApy', () => {
    const actual = getMaxApy(mockedApyResponse.data);

    expect(actual).toStrictEqual(maxApy);
  });

  it('should return apy/complete response & also max', async () => {
    getStakeApyMock();

    const actual = await getStakeApy();

    expect(actual.max).toStrictEqual(maxApy);
    expect(actual).toStrictEqual({ max: maxApy, ...mockedApyResponse.data });
  });

  it('should throw Error', async () => {
    getStakeApyMock(true);

    try {
      await getStakeApy();
    } catch (error) {
      const { NO_APY_DATA } = ERROR_CODE;

      expect(error.message).toEqual(ERROR_MESSAGE[NO_APY_DATA]);
      expect(error.code).toEqual(NO_APY_DATA);
      expect(error.codeDesc).toEqual(ERROR_CODE_DESC[NO_APY_DATA]);
    }
  });
});
