'use client'

import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  className?: string
  appName: string
  type?: 'submit' | 'reset' | 'button' | undefined
}

export const Button = ({ children, className, appName, type }: ButtonProps) => (
  <button
    type={type}
    className={className}
    onClick={() => alert(`Hello from your ${appName} app!`)}
  >
    {children}
  </button>
)
