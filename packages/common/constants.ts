export const SOL_API_HOST = 'https://sol-api-pub.lido.fi';

// 1xx - blockchain error
// 2xx - protocol errors
// 3xx - sdk errors
// 4xx - user's errors
export enum ERROR_CODE {
  CANNOT_CONFIRM_TRANSACTION = 100,
  NO_VALIDATORS = 200,
  UNSUPPORTED_CLUSTER = 300,
  UNSTAKE_UNAVAILABLE = 301,
  NO_PUBLIC_KEY = 302,
  NO_ACCOUNT_INFO = 303,
  NO_APY_DATA = 304,
  EXCEED_MAX = 400,
  PUBLIC_KEY_IS_PDA = 401, // PDA (Program Derived Address)
}

export const ERROR_CODE_DESC: Record<ERROR_CODE, string> = {
  [ERROR_CODE.CANNOT_CONFIRM_TRANSACTION]: 'CANNOT_CONFIRM_TRANSACTION',
  [ERROR_CODE.NO_VALIDATORS]: 'NO_VALIDATORS',
  [ERROR_CODE.UNSUPPORTED_CLUSTER]: 'UNSUPPORTED_CLUSTER',
  [ERROR_CODE.UNSTAKE_UNAVAILABLE]: 'UNSTAKE_UNAVAILABLE',
  [ERROR_CODE.NO_PUBLIC_KEY]: 'NO_PUBLIC_KEY',
  [ERROR_CODE.NO_ACCOUNT_INFO]: 'NO_ACCOUNT_INFO',
  [ERROR_CODE.NO_APY_DATA]: 'NO_APY_DATA',
  [ERROR_CODE.EXCEED_MAX]: 'EXCEED_MAX',
  [ERROR_CODE.PUBLIC_KEY_IS_PDA]: 'PUBLIC_KEY_IS_PDA',
};

export const ERROR_MESSAGE: Partial<Record<ERROR_CODE, string>> = {
  [ERROR_CODE.NO_VALIDATORS]: `Couldn't fetch validators list`,
  [ERROR_CODE.UNSUPPORTED_CLUSTER]: `SolidoSDK doesn't support devnet, please specify mainnet-beta or testnet`,
  [ERROR_CODE.UNSTAKE_UNAVAILABLE]:
    'Sorry, unStake is not available right now. Please contact lido developers for details.',
  [ERROR_CODE.NO_PUBLIC_KEY]: 'SolidoSDK: publicKey is null in wallet',
  [ERROR_CODE.NO_ACCOUNT_INFO]: `Couldn't fetch getAccountInfo`,
  [ERROR_CODE.NO_APY_DATA]: `Couldn't fetch apy data`,
  [ERROR_CODE.PUBLIC_KEY_IS_PDA]: 'Your publicKey is PDA type. Please use allowOwnerOffCurve=true flag.',
};
