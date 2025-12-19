import { z } from 'zod'

export const GetUsersInputSchema = z.object({
  page: z.number().optional().default(1),
})

export type GetUsersInput = z.infer<typeof GetUsersInputSchema>
