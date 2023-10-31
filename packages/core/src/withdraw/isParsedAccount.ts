import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js';

type AccountWithPubkey<T = Buffer | ParsedAccountData> = { pubkey: PublicKey; account: AccountInfo<T> };

export function isParsedAccount(account: AccountWithPubkey): account is AccountWithPubkey<ParsedAccountData> {
  return (account.account.data as ParsedAccountData).parsed !== undefined;
}
