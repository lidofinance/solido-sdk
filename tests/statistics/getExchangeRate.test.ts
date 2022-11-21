import { SolidoSDK } from '@/index';
import { mockValidatorList } from '../mocks/validators';
import { getConnection } from '../helpers';
import { CLUSTER } from '../constants';

describe('getExchangeRate', () => {
  let sdk, connection;

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);
  });

  test('exchange rate returned properties', async () => {
    mockValidatorList(connection); // making test faster, validator list is heavy

    const { SOLToStSOL, stSOLToSOL } = await sdk.getExchangeRate();

    expect(typeof stSOLToSOL).toBe('number');
    expect(typeof SOLToStSOL).toBe('number');

    expect(SOLToStSOL).toBeLessThanOrEqual(1);
    expect(stSOLToSOL).toBeGreaterThanOrEqual(1);
  });
});
