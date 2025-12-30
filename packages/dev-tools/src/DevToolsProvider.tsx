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

//  - Detects long blocking tasks
const initLongTaskObserver = (): void => {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.group(`🐌 LONG TASK (${entry.duration.toFixed(0)}ms)`)
          console.log('Start:', `${entry.startTime.toFixed(0)}ms`)

          // Get the actual script info
          const longTask = entry as PerformanceEntry & {
            attribution?: Array<{
              containerType?: string
              containerSrc?: string
              containerId?: string
              containerName?: string
            }>
          }

          if (longTask.attribution && longTask.attribution.length > 0) {
            for (const attr of longTask.attribution) {
              console.log('Container:', attr.containerType)
              console.log('Script:', attr.containerSrc || 'inline')
              console.log('ID:', attr.containerId || 'none')
              console.log('Name:', attr.containerName || 'none')
            }
          }

          //  - Get stack trace
          console.trace('Stack trace for long task')

          console.groupEnd()
        }
      }
    })

    observer.observe({ entryTypes: ['longtask'] })
  } catch {
    // Not supported
  }
}

//  - Lists all render-blocking resources
const logBlockingResources = (): void => {
  setTimeout(() => {
    const resources = performance.getEntriesByType(
      'resource'
    ) as PerformanceResourceTiming[]

    const blocking = resources.filter(
      (r) =>
        (r as PerformanceResourceTiming & { renderBlockingStatus?: string })
          .renderBlockingStatus === 'blocking'
    )

    if (blocking.length > 0) {
      console.group('🚫 RENDER BLOCKING RESOURCES')
      for (const r of blocking) {
        console.log(r.name.split('/').pop())
      }
      console.warn('💡 FIX: Use next/script with strategy="lazyOnload"')
      console.groupEnd()
    }
  }, 3000)
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
  initLongTaskObserver() //
  logBlockingResources() //

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
