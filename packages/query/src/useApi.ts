'use client'
import type { ApiError } from '@repo/api'
import {
  type QueryKey,
  type UseQueryOptions,
  useQuery,
} from '@tanstack/react-query'

export function useApi<TParams, TResponse>(
  queryKey: QueryKey,
  fetcher: (input: TParams) => Promise<TResponse>,
  params: TParams,
  options?: Omit<UseQueryOptions<TResponse, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TResponse, ApiError>({
    queryKey,
    queryFn: () => fetcher(params),
    ...options,
  })
}
