import { Connection } from '@solana/web3.js';

import fs from 'fs';
import path from 'path';

import { reserveAccount } from './data/snapshot';

const connection = new Connection(
  'https://pyth-testnet-rpc-1.solana.p2p.org/yIwMoknPihQvrhSyxafcHvsAqkOE7KKrBUpplM5Xf',
);

const updateReserveAccountInfoDump = async () => {
  const accountInfo = await connection.getAccountInfo(reserveAccount);

  if (accountInfo === null) {
    console.log('getAccountInfo of reserveAccount returned null, try again');
    return;
  }

  fs.writeFileSync(
    path.join(__dirname, 'data', 'reserve_account_info.json'),
    JSON.stringify(accountInfo),
    'utf-8',
  );
};

void updateReserveAccountInfoDump();
