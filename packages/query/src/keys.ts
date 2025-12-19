export const queryKeys = {
  users: {
    all: ['users'] as const,
    list: (params: Record<string, unknown>) =>
      ['users', 'list', params] as const,
  },
}
