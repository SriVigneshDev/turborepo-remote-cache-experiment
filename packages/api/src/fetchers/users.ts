import { api } from '../api-client/client'
import { GetUsersInputSchema } from '../schemas/inputs/users'
import {
  type GetUsersInput,
  type UsersResponse,
  UsersResponseSchema,
} from '../schemas/outputs/users'

export async function fetchUsers(
  params: GetUsersInput
): Promise<UsersResponse> {
  const input = GetUsersInputSchema.parse(params)
  const { data } = await api.get('/users', { params: input })
  return UsersResponseSchema.parse(data)
}
