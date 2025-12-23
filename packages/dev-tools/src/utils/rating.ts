const RATING_EMOJIS: Record<string, string> = {
  good: '🟢',
  'needs-improvement': '🟡',
  poor: '🔴',
}

export const getRatingEmoji = (rating: string): string =>
  RATING_EMOJIS[rating] ?? '⚪'
