import { Connection } from '@solana/web3.js';
import { INSTRUCTION, SolidoSDK } from '@/index';

import { getSolPriceMock } from '../mocks/getSolPrice';
import { getConnection } from '../helpers';
import { CLUSTER } from '../constants';

describe('getTransactionCost', () => {
  const lamportsPerSignature = 50000000;
  const priceUsd = 20;
  let sdk: SolidoSDK;
  let connection: Connection;

  beforeAll(() => {
    connection = getConnection();
    sdk = new SolidoSDK(CLUSTER, connection);

    global.fetch = jest.fn();
  });

  test('transaction cost in sol, usd, lamports', async () => {
    jest
      .spyOn(connection, 'getRecentBlockhash')
      // @ts-expect-error not important all fields
      .mockReturnValueOnce({ feeCalculator: { lamportsPerSignature } });
    getSolPriceMock(priceUsd);

    const { costInUsd, costInSol, costInLamports } = await sdk.getTransactionCost(INSTRUCTION.STAKE);

    expect(costInLamports).toEqual(lamportsPerSignature);
    expect(costInSol).toEqual(0.05);
    expect(costInUsd).toEqual(0.05 * priceUsd);
  });
});
