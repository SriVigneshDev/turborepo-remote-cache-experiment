export const logMetricEntry = (label: string, value: string | number): void => {
  console.log(`${label}:`, value)
}

export const logMetricEntryMs = (label: string, value: number): void => {
  console.log(`${label}:`, `${value.toFixed(0)} ms`)
}

export const logHeader = (title: string, emoji = '🛠️'): void => {
  console.log('')
  console.log(`${emoji} ${'═'.repeat(40)}`)
  console.log(`${emoji} ${title}`)
  console.log(`${emoji} ${'═'.repeat(40)}`)
  console.log('')
}

export const logSuccess = (tool: string, message: string): void => {
  console.log(`✅ ${tool}: ${message}`)
}

export const logWarning = (
  tool: string,
  message: string,
  error?: unknown
): void => {
  if (error) {
    console.warn(`⚠️ ${tool}: ${message}`, error)
  } else {
    console.warn(`⚠️ ${tool}: ${message}`)
  }
}

export const logRoute = (pathname: string): void => {
  console.log(`📍 Route: ${pathname}`)
}
