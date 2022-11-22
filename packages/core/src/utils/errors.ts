import { ApiError, BatchError } from '@/types';

export const hasAPIError = (batchError: BatchError, error?: ApiError) =>
  !!((batchError && Object.keys(batchError).length > 0) || error);
