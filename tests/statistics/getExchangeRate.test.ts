import { SolidoSDK } from '@/index';
import { mockValidatorList } from '../mocks/validators';
import { getConnection } from '../helpers';

describe('getExchangeRate', () => {
  const cluster = 'testnet';
  let sdk, connection;

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(cluster, connection);
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
