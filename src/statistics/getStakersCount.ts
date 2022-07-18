import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { SolidoSDK } from '@/index';
import { formatWithCommas } from '@/utils/formatters';

const countAccounts = async (connection, filters) => {
  const accounts = await connection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID,
    {
      filters,
      // We are not interested in the account data, only in the number of matching
      // accounts, so request a zero-sized slice of the data, to reduce the amount
      // of data that needs to be sent.
      encoding: 'base64',
      dataSlice: {
        offsset: 0,
        length: 0,
      },
  });

  return accounts.length;
};

export async function getStakersCount(this: SolidoSDK) {
  const { stSolMintAddress } = this.programAddresses;

  // All SPL token accounts should have a size of 165 bytes.
  const filterSize = { dataSize: 165 };
  // The first 32 bytes of an SPL token account store its mint address.
  const filterMint = {
    memcmp: { bytes: stSolMintAddress.toString(), offset: 0 },
  };

  // If we want to find all empty accounts, we must find all accounts where the
  // `amount` field (a little-endian 64-bit unsigned integer) is 0 (all ones
  // when encoded as base58). The offset of the `amount` field is at 64 bytes:
  // it follows the mint and owner pubkey (each 32 bytes). See also
  // https://github.com/solana-labs/solana-program-library/blob/583afbd35f8ad16bf844386183c2cfd5cbd6fac3/token/program/src/state.rs#L92
  const filterEmpty = { memcmp: { bytes: '11111111', offset: 64 } };

  // To get the number of non-empty stSOL accounts, we make two queries: one to
  // get all of them, one to get just the empty ones. Then the non-empty ones is
  // the difference. This approach is incorrect, because accounts could change
  // in between the two reads, and then we return a bogus result. Unfortunately,
  // there is no way to avoid this, the Solana RPC offers only one primitive for
  // atomic reads (getMultipleAccounts), and it can’t be used to find all stSOL
  // accounts. :'(
  const accountsTotal = await countAccounts(this.connection, [filterSize, filterMint]);
  const accountsEmpty = await countAccounts(this.connection, [filterSize, filterMint, filterEmpty]);

  return {
    stakers: accountsTotal - accountsEmpty,
    description: `We do not and cannot indentify individuals; this number is the number of stSOL token accounts with a non-zero balance. ${
      accountsTotal && accountsEmpty
        ? `In total there are ${formatWithCommas(accountsTotal)} stSOL token accounts,
          but ${formatWithCommas(accountsEmpty)} of those are empty.`
        : ''
    }`
  };
}
