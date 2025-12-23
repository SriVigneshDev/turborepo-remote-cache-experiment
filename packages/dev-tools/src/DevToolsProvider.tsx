'use client'

import { type ReactNode, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import {
  handleCLS,
  handleFCP,
  handleINP,
  handleLCP,
  handleTTFB,
  logHeader,
  logRoute,
  logSuccess,
  logWarning,
} from './utils'

const initReactScan = async (): Promise<void> => {
  try {
    const { scan } = await import('react-scan')
    scan({
      enabled: true,
      log: true,
      showToolbar: true,
    })
    logSuccess('React-Scan', 'Render detection enabled')
  } catch (err) {
    logWarning('React-Scan', 'Failed to load (optional tool)', err)
  }
}

const initWebVitals = async (): Promise<void> => {
  try {
    const { onCLS, onLCP, onINP, onFCP, onTTFB } = await import(
      'web-vitals/attribution'
    )

    onCLS(handleCLS)
    onLCP(handleLCP)
    onINP(handleINP)
    onFCP(handleFCP)
    onTTFB(handleTTFB)

    logSuccess('Web Vitals', 'Performance monitoring enabled')
  } catch (err) {
    logWarning('Web Vitals', 'Failed to load', err)
  }
}

const initDevTools = async (): Promise<void> => {
  logHeader('Initializing Dev Tools...')

  await initReactScan()
  await initWebVitals()

  logHeader('Dev Tools Ready!')
}

interface DevToolsProviderProps {
  children: ReactNode
}

const IS_DEV = process.env.NODE_ENV === 'development'

export function DevToolsProvider({
  children,
}: DevToolsProviderProps): ReactNode {
  const pathname = usePathname()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!IS_DEV) {
      return
    }
    if (typeof window === 'undefined') {
      return
    }
    if (initializedRef.current) {
      return
    }

    initializedRef.current = true

    initDevTools().catch((err: unknown) => {
      logWarning('Dev Tools', 'Failed to initialize', err)
    })
  }, [])

  useEffect(() => {
    if (!IS_DEV) {
      return
    }
    logRoute(pathname)
  }, [pathname])

  return children
}
