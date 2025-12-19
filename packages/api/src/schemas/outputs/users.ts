import type { GetUsersInputSchema } from '../inputs/users'
import z from 'zod'

export const UserSchema = z.object({
  id: z.number(),
  email: z.email(),
  first_name: z.string(),
  last_name: z.string(),
  avatar: z.url(),
})

export const SupportSchema = z.object({
  url: z.string(),
  text: z.string(),
})

export const UsersResponseSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  total: z.number(),
  total_pages: z.number(),
  data: z.array(UserSchema),
  support: SupportSchema,
})

// ============ TYPES ============
export type GetUsersInput = z.infer<typeof GetUsersInputSchema>
export type User = z.infer<typeof UserSchema>
export type UsersResponse = z.infer<typeof UsersResponseSchema>
