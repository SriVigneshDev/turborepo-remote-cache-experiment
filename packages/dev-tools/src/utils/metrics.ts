import { logMetricEntry, logMetricEntryMs } from './logger'
import { getRatingEmoji } from './rating'
import type {
  CLSMetricWithAttribution,
  FCPMetricWithAttribution,
  INPMetricWithAttribution,
  LCPMetricWithAttribution,
  TTFBMetricWithAttribution,
} from 'web-vitals/attribution'

export const handleCLS = (metric: CLSMetricWithAttribution): void => {
  const emoji = getRatingEmoji(metric.rating)
  const { attribution } = metric

  console.group(`${emoji} CLS (Cumulative Layout Shift)`)
  logMetricEntry('Score', metric.value.toFixed(4))
  logMetricEntry('Rating', metric.rating)

  if (attribution.largestShiftTarget) {
    logMetricEntry('Element', attribution.largestShiftTarget)
  }
  if (attribution.largestShiftTime) {
    logMetricEntryMs('Shift Time', attribution.largestShiftTime)
  }
  if (attribution.largestShiftValue) {
    logMetricEntry('Shift Value', attribution.largestShiftValue)
  }

  console.groupEnd()
}

export const handleLCP = (metric: LCPMetricWithAttribution): void => {
  const emoji = getRatingEmoji(metric.rating)
  const { attribution } = metric

  console.group(`${emoji} LCP (Largest Contentful Paint)`)
  logMetricEntryMs('Time', metric.value)
  logMetricEntry('Rating', metric.rating)

  if (attribution.target) {
    logMetricEntry('Element', attribution.target)
  }
  if (attribution.url) {
    logMetricEntry('Resource URL', attribution.url)
  }
  if (attribution.timeToFirstByte) {
    logMetricEntryMs('TTFB', attribution.timeToFirstByte)
  }
  if (attribution.resourceLoadDelay) {
    logMetricEntryMs('Resource Load Delay', attribution.resourceLoadDelay)
  }
  if (attribution.resourceLoadDuration) {
    logMetricEntryMs('Resource Load Duration', attribution.resourceLoadDuration)
  }
  if (attribution.elementRenderDelay) {
    logMetricEntryMs('Element Render Delay', attribution.elementRenderDelay)
  }

  console.groupEnd()
}

export const handleINP = (metric: INPMetricWithAttribution): void => {
  const emoji = getRatingEmoji(metric.rating)
  const { attribution } = metric

  console.group(`${emoji} INP (Interaction to Next Paint)`)
  logMetricEntryMs('Delay', metric.value)
  logMetricEntry('Rating', metric.rating)

  if (attribution.interactionTarget) {
    logMetricEntry('Target', attribution.interactionTarget)
  }
  if (attribution.interactionType) {
    logMetricEntry('Event Type', attribution.interactionType)
  }
  if (attribution.interactionTime) {
    logMetricEntryMs('Interaction Time', attribution.interactionTime)
  }
  if (attribution.inputDelay) {
    logMetricEntryMs('Input Delay', attribution.inputDelay)
  }
  if (attribution.processingDuration) {
    logMetricEntryMs('Processing Duration', attribution.processingDuration)
  }
  if (attribution.presentationDelay) {
    logMetricEntryMs('Presentation Delay', attribution.presentationDelay)
  }

  console.groupEnd()
}

export const handleFCP = (metric: FCPMetricWithAttribution): void => {
  const emoji = getRatingEmoji(metric.rating)
  const { attribution } = metric

  console.group(`${emoji} FCP (First Contentful Paint)`)
  logMetricEntryMs('Time', metric.value)
  logMetricEntry('Rating', metric.rating)

  if (attribution.timeToFirstByte) {
    logMetricEntryMs('TTFB', attribution.timeToFirstByte)
  }
  if (attribution.firstByteToFCP) {
    logMetricEntryMs('First Byte to FCP', attribution.firstByteToFCP)
  }

  console.groupEnd()
}

export const handleTTFB = (metric: TTFBMetricWithAttribution): void => {
  const emoji = getRatingEmoji(metric.rating)
  const { attribution } = metric

  console.group(`${emoji} TTFB (Time to First Byte)`)
  logMetricEntryMs('Time', metric.value)
  logMetricEntry('Rating', metric.rating)

  if (attribution.waitingDuration) {
    logMetricEntryMs('Waiting Duration', attribution.waitingDuration)
  }
  if (attribution.dnsDuration) {
    logMetricEntryMs('DNS Duration', attribution.dnsDuration)
  }
  if (attribution.connectionDuration) {
    logMetricEntryMs('Connection Duration', attribution.connectionDuration)
  }
  if (attribution.requestDuration) {
    logMetricEntryMs('Request Duration', attribution.requestDuration)
  }

  console.groupEnd()
}
