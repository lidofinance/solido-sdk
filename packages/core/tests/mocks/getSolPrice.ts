export const getSolPriceMock = (priceUsd: number) => {
  jest.spyOn(global, 'fetch').mockReturnValueOnce(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Promise.resolve({
      json: () => Promise.resolve({ batchData: { SOL: { priceUsd } } }),
    }),
  );
};
