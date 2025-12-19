import type { QueryClient, QueryKey } from '@tanstack/react-query'

// ============ TYPES ============

export type ApiError = {
  status: number
  message: string
}

export type SafeQueryResult<TData> = {
  data: TData | null
  error: ApiError | null
}

export type SafeQueryOptions<TData> = {
  staleTime?: number
  onSuccess?: (data: TData) => void | Promise<void>
  onError?: (error: ApiError) => void | Promise<void>
}

// ============ SINGLE QUERY ============

/**
 * Safe wrapper over fetchQuery that returns { data, error } instead of throwing
 * Data is cached in QueryClient for hydration
 *
 * @example
 * const { data, error } = await safeServerFetchQuery(
 *   queryClient,
 *   queryKeys.users.list({ page: 1 }),
 *   () => fetchUsers({ page: 1 })
 * )
 */
export async function safeServerFetchQuery<TData>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: SafeQueryOptions<TData>
): Promise<SafeQueryResult<TData>> {
  const { staleTime, onSuccess, onError } = options ?? {}

  try {
    const data = await queryClient.fetchQuery({
      queryKey,
      queryFn,
      staleTime,
    })

    if (onSuccess) {
      await onSuccess(data)
    }

    return { data, error: null }
  } catch (err: unknown) {
    const error = extractError(err)

    if (onError) {
      await onError(error)
    }

    return { data: null, error }
  }
}

// ============ MULTIPLE QUERIES ============

export type QueryConfig<TData> = {
  queryKey: QueryKey
  queryFn: () => Promise<TData>
  staleTime?: number
}

export type SafeMultiQueryResult<T extends Record<string, unknown>> = {
  data: { [K in keyof T]: T[K] | null }
  errors: { [K in keyof T]?: ApiError }
  hasError: boolean
}

/**
 * Fetch multiple queries in parallel safely
 *
 * @example
 * const { data, errors, hasError } = await safeServerFetchQueries(queryClient, {
 *   users: {
 *     queryKey: queryKeys.users.list({ page: 1 }),
 *     queryFn: () => fetchUsers({ page: 1 }),
 *   },
 *   posts: {
 *     queryKey: queryKeys.posts.list(),
 *     queryFn: () => fetchPosts(),
 *   },
 * })
 */
export async function safeServerFetchQueries<T extends Record<string, unknown>>(
  queryClient: QueryClient,
  queries: { [K in keyof T]: QueryConfig<T[K]> }
): Promise<SafeMultiQueryResult<T>> {
  const keys = Object.keys(queries) as (keyof T)[]

  const results = await Promise.all(
    keys.map(async (key) => {
      const config = queries[key]
      const result = await safeServerFetchQuery(
        queryClient,
        config.queryKey,
        config.queryFn,
        { staleTime: config.staleTime }
      )
      return { key, ...result }
    })
  )

  const data = {} as { [K in keyof T]: T[K] | null }
  const errors = {} as { [K in keyof T]?: ApiError }
  let hasError = false

  for (const result of results) {
    data[result.key] = result.data
    if (result.error) {
      errors[result.key] = result.error
      hasError = true
    }
  }

  return { data, errors, hasError }
}

// ============ ERROR EXTRACTOR ============

function extractError(err: unknown): ApiError {
  const axiosError = err as {
    response?: {
      status?: number
      data?: { message?: string; error?: string }
    }
    message?: string
    status?: number
  }

  const status = axiosError.response?.status ?? axiosError.status ?? 500

  const message =
    axiosError.response?.data?.message ??
    axiosError.response?.data?.error ??
    axiosError.message ??
    'Something went wrong'

  return { status, message }
}
