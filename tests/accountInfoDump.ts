import fs from 'fs';
import path from 'path';

import { reserveAccount } from './data/snapshot';
import { getConnection } from './helpers';

const connection = getConnection();

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
