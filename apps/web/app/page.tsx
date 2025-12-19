import { UsersClient } from './components/UsersClient'
import { fetchUsers, type GetUsersInput } from '@repo/api'
import { queryKeys, safeServerFetchQuery } from '@repo/query'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function UsersPage({ searchParams }: Props) {
  const params = await searchParams
  const queryClient = new QueryClient()

  // 1. Build type-safe params from URL
  const queryParams: GetUsersInput = {
    page: params.page ? Number(params.page) : 1,
  }

  // 2. Prefetch on Server
  const { error } = await safeServerFetchQuery(
    queryClient,
    queryKeys.users.list(queryParams),
    () => fetchUsers(queryParams)
  )

  // 3. Handle error
  if (error) {
    return (
      <div className="p-8">
        <h1 className="font-bold text-2xl text-red-600">
          Error {error.status}
        </h1>
        <p className="text-gray-600">{error.message}</p>
      </div>
    )
  }

  // 3. Pass dehydrated state to client
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersClient initialParams={queryParams} />
    </HydrationBoundary>
  )
}
