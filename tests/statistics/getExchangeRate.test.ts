import { Connection } from '@solana/web3.js';
import { SolidoSDK } from '@/index';
import { getExchangeRate } from '@/statistics/getExchangeRate';
import { mockValidatorList } from '../mocks/validators';

describe('getExchangeRate', () => {
  const cluster = 'testnet';
  let sdk, connection;

  beforeAll(async () => {
    connection = new Connection('https://api.testnet.solana.com/');
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
