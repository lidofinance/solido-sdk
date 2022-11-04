export const getSolPriceMock = (priceUsd: number) => {
  jest.spyOn(global, 'fetch').mockReturnValueOnce(
    // @ts-ignore
    Promise.resolve({
      json: () => Promise.resolve({ batchData: { SOL: { priceUsd } } }),
    }),
  );
};
