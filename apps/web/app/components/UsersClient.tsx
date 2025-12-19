'use client'

import { useState } from 'react'
import { fetchUsers, type GetUsersInput } from '@repo/api'
import { queryKeys, useApi } from '@repo/query'

interface Props {
  initialParams: GetUsersInput
}

export function UsersClient({ initialParams }: Props) {
  const [params] = useState(initialParams)

  const { data } = useApi(queryKeys.users.list(params), fetchUsers, params)

  return (
    <div className="items flex justify-center">
      {data?.data.map((user) => (
        <h1 key={user.id}>{user.first_name}</h1>
      ))}
    </div>
  )
}
