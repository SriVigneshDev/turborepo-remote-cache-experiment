'use client'

import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'

const DevToolsProvider = dynamic(
  () => import('./DevToolsProvider').then((mod) => mod.DevToolsProvider),
  {
    ssr: false,
    loading: () => null,
  }
)

interface DevToolsProps {
  children: ReactNode
}

export function DevTools({ children }: DevToolsProps): ReactNode {
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>
  }

  return <DevToolsProvider>{children}</DevToolsProvider>
}
