import { logMetricEntry, logMetricEntryMs } from './logger'
import { getRatingEmoji } from './rating'
import type {
  CLSMetricWithAttribution,
  FCPMetricWithAttribution,
  INPMetricWithAttribution,
  LCPMetricWithAttribution,
  TTFBMetricWithAttribution,
} from 'web-vitals/attribution'

const highlightElement = (
  selector: string | undefined,
  color: string
): void => {
  if (!selector) {
    return
  }
  try {
    const el = document.querySelector(selector) as HTMLElement
    if (el) {
      el.style.outline = `4px solid ${color}`
      console.log('👆 SOURCE ELEMENT:', el)
      setTimeout(() => {
        el.style.outline = ''
      }, 5000)
    }
  } catch {
    // ignore
  }
}

export const handleCLS = (metric: CLSMetricWithAttribution): void => {
  const emoji = getRatingEmoji(metric.rating)
  const { attribution } = metric

  console.group(`${emoji} CLS (Cumulative Layout Shift)`)
  logMetricEntry('Score', metric.value.toFixed(4))
  logMetricEntry('Rating', metric.rating)

  // 🔴 ADD THIS - Shows the actual element
  if (attribution.largestShiftTarget) {
    logMetricEntry('🎯 SOURCE', attribution.largestShiftTarget)
    highlightElement(attribution.largestShiftTarget, 'orange')
  }

  // 🔴 ADD THIS - Shows what caused the shift
  const lcEntry = attribution.largestShiftEntry
  if (lcEntry?.sources && lcEntry.sources.length > 0) {
    console.log('📍 Shift Sources:')
    lcEntry.sources.forEach((source, i) => {
      console.log(`  ${i + 1}. Node:`, source.node)
    })
  }

  console.groupEnd()
}

export const handleLCP = (metric: LCPMetricWithAttribution): void => {
  const emoji = getRatingEmoji(metric.rating)
  const { attribution } = metric

  console.group(`${emoji} LCP (Largest Contentful Paint)`)
  logMetricEntryMs('Time', metric.value)
  logMetricEntry('Rating', metric.rating)

  // 🔴 ADD THIS - Shows the actual LCP element
  if (attribution.lcpEntry?.element) {
    const el = attribution.lcpEntry.element as HTMLElement
    console.log('🎯 SOURCE ELEMENT:', el)
    console.log('   Tag:', el.tagName)
    console.log('   ID:', el.id || '(none)')
    console.log('   Class:', el.className || '(none)')

    // If image - show src
    if (el.tagName === 'IMG') {
      const img = el as HTMLImageElement
      console.log('   Image URL:', img.src)
      console.warn('   💡 FIX: Add priority prop → <Image priority />')
    }

    // Highlight it
    el.style.outline = '4px solid red'
    setTimeout(() => {
      el.style.outline = ''
    }, 5000)
  }

  // 🔴 ADD THIS - Shows breakdown
  console.log('⏱️ TIME BREAKDOWN:')
  console.table({
    'Server (TTFB)': `${attribution.timeToFirstByte?.toFixed(0)}ms`,
    'Load Delay': `${attribution.resourceLoadDelay?.toFixed(0)}ms`,
    'Load Duration': `${attribution.resourceLoadDuration?.toFixed(0)}ms`,
    'Render Delay': `${attribution.elementRenderDelay?.toFixed(0)}ms`,
  })

  console.groupEnd()
}

export const handleINP = (metric: INPMetricWithAttribution): void => {
  const emoji = getRatingEmoji(metric.rating)
  const { attribution } = metric

  console.group(`${emoji} INP (Interaction to Next Paint)`)
  logMetricEntryMs('Delay', metric.value)
  logMetricEntry('Rating', metric.rating)

  // 🔴 ADD THIS
  if (attribution.interactionTarget) {
    logMetricEntry('🎯 SOURCE', attribution.interactionTarget)
    highlightElement(attribution.interactionTarget, 'purple')
  }

  // 🔴 ADD THIS - Shows what's slow
  console.log('⏱️ TIME BREAKDOWN:')
  console.table({
    'Input Delay': `${attribution.inputDelay?.toFixed(0)}ms`,
    Processing: `${attribution.processingDuration?.toFixed(0)}ms`,
    Presentation: `${attribution.presentationDelay?.toFixed(0)}ms`,
  })

  //  Shows the slow event handlers
  const longTasks = attribution.longAnimationFrameEntries ?? []

  if (longTasks.length > 0) {
    console.log('🐌 SLOW SCRIPTS:')

    for (const task of longTasks) {
      const scripts = task.scripts ?? []

      if (scripts.length > 0) {
        for (const script of scripts) {
          console.log('   Script:', script.sourceURL || 'inline')
          console.log('   Function:', script.sourceFunctionName || 'anonymous')
          console.log('   Duration:', `${script.duration?.toFixed(0)}ms`)
        }
      }
    }
  }

  console.groupEnd()
}

export const handleFCP = (metric: FCPMetricWithAttribution): void => {
  const emoji = getRatingEmoji(metric.rating)
  const { attribution } = metric

  console.group(`${emoji} FCP (First Contentful Paint)`)
  logMetricEntryMs('Time', metric.value)
  logMetricEntry('Rating', metric.rating)

  // 🔴 ADD THIS
  console.log('⏱️ TIME BREAKDOWN:')
  console.table({
    TTFB: `${attribution.timeToFirstByte?.toFixed(0)}ms`,
    'First Byte → FCP': `${attribution.firstByteToFCP?.toFixed(0)}ms`,
  })

  console.groupEnd()
}

export const handleTTFB = (metric: TTFBMetricWithAttribution): void => {
  const emoji = getRatingEmoji(metric.rating)
  const { attribution } = metric

  console.group(`${emoji} TTFB (Time to First Byte)`)
  logMetricEntryMs('Time', metric.value)
  logMetricEntry('Rating', metric.rating)

  // 🔴 ADD THIS
  console.log('⏱️ TIME BREAKDOWN:')
  console.table({
    Waiting: `${attribution.waitingDuration?.toFixed(0)}ms`,
    DNS: `${attribution.dnsDuration?.toFixed(0)}ms`,
    Connection: `${attribution.connectionDuration?.toFixed(0)}ms`,
    Request: `${attribution.requestDuration?.toFixed(0)}ms`,
  })

  console.groupEnd()
}
