import { SolidoSDK } from '@/index';
import { getConnection } from '../helpers';

describe('getStakersCount', () => {
  const cluster = 'testnet';
  let sdk, connection;

  beforeAll(async () => {
    connection = getConnection();
    sdk = new SolidoSDK(cluster, connection);
  });

  test('stakersCount accounts quantity', async () => {
    jest
      .spyOn(connection, 'getProgramAccounts')
      .mockReturnValueOnce([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) // accountsTotal
      .mockReturnValueOnce([1, 2, 3, 4, 5]); // accountsEmpty

    const stakersCount = await sdk.getStakersCount();

    expect(stakersCount.accountsTotal).toEqual(10);
    expect(stakersCount.accountsEmpty).toEqual(5);
    expect(stakersCount.value).toEqual(5); // accountsTotal - accountsEmpty
  });
});
