export const biToUint8Array = (value: bigint, length = 8): Uint8Array => {
  const result = new Uint8Array(length);
  let i = 0;
  let bn = value;
  const n256 = BigInt(256);
  while (bn > 0) {
    result[i] = Number(bn % n256);
    bn /= n256;
    i += 1;
  }
  return result;
};
