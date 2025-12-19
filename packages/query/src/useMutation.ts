'use client'
import type { ApiError } from '@repo/api'
import {
  type QueryKey,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

interface MutationOptions<TParams, TResponse, TContext = unknown>
  extends Omit<
    UseMutationOptions<TResponse, ApiError, TParams, TContext>,
    'mutationFn'
  > {
  invalidateKeys?: QueryKey[]
}

export function useApiMutation<TParams, TResponse, TContext = unknown>(
  mutationFn: (params: TParams) => Promise<TResponse>,
  options?: MutationOptions<TParams, TResponse, TContext>
) {
  const queryClient = useQueryClient()
  const { invalidateKeys, onSuccess, ...rest } = options ?? {}

  return useMutation<TResponse, ApiError, TParams, TContext>({
    mutationFn,
    onSuccess: async (data, variables, context, meta) => {
      if (invalidateKeys) {
        await Promise.all(
          invalidateKeys.map((k) =>
            queryClient.invalidateQueries({ queryKey: k })
          )
        )
      }
      onSuccess?.(data, variables, context, meta)
    },
    ...rest,
  })
}
