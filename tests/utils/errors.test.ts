import { hasAPIError } from '@/utils/errors';

describe('hasAPIError', () => {
  it('should return true with batchError', () => {
    const actual = hasAPIError({
      notExistEntity: {
        code: 'EntityNotFoundError',
        msg: 'Could not find any entity of type SomeEntity matching...',
      },
    });

    expect(actual).toBe(true);
  });

  it('should return true with error', () => {
    const actual = hasAPIError(
      {},
      {
        code: 'EntityNotFoundError',
        msg: 'Could not find any entity of type SomeEntity matching...',
      },
    );

    expect(actual).toBe(true);
  });

  it('should return false when there is no error', () => {
    const actual = hasAPIError({});

    expect(actual).toBe(false);
  });
});
