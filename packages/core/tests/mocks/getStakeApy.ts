export const getStakeApyMock = (apy: number) => {
  jest.spyOn(global, 'fetch').mockReturnValueOnce(
    // @ts-ignore
    Promise.resolve({
      json: () => Promise.resolve({ data: { apy } }),
    }),
  );
};
