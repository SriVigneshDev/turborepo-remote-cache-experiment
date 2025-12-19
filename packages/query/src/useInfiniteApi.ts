'use client'

import type { ApiError } from '@repo/api'
import { type QueryKey, useInfiniteQuery } from '@tanstack/react-query'

export interface PaginatedResponse<TData> {
  data: TData[]
  nextCursor?: string | number | null
  prevCursor?: string | number | null
  hasMore?: boolean
  total?: number
}

type PageParam = string | number | null | undefined

export function useInfiniteApi<
  TParams extends Record<string, unknown>,
  TData,
  TResponse extends PaginatedResponse<TData> = PaginatedResponse<TData>,
>(
  queryKey: QueryKey,
  queryFn: (input: TParams & { pageParam?: PageParam }) => Promise<TResponse>,
  params: TParams,
  options?: {
    enabled?: boolean
    staleTime?: number
    gcTime?: number
    refetchOnWindowFocus?: boolean
    refetchOnMount?: boolean
    retry?: boolean | number
    getNextPageParam?: (lastPage: TResponse) => PageParam
    getPreviousPageParam?: (firstPage: TResponse) => PageParam
    onError?: (error: ApiError) => void
  }
) {
  const { getNextPageParam, getPreviousPageParam, ...rest } = options ?? {}

  return useInfiniteQuery<TResponse, ApiError, TResponse, QueryKey, PageParam>({
    queryKey: [...queryKey, params],
    queryFn: ({ pageParam }) =>
      queryFn({ ...params, pageParam: pageParam as PageParam }),
    initialPageParam: undefined as PageParam,
    getNextPageParam:
      getNextPageParam ??
      ((lastPage) => {
        if (lastPage.hasMore === false) {
          return
        }
        return lastPage.nextCursor ?? undefined
      }),
    getPreviousPageParam:
      getPreviousPageParam ??
      ((firstPage) => firstPage.prevCursor ?? undefined),
    ...rest,
  })
}
