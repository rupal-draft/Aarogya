"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type AnimationContextType = {
  isReducedMotion: boolean
  prefersReducedMotion: boolean
  enableAnimations: boolean
  toggleAnimations: () => void
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export const useAnimation = () => {
  const context = useContext(AnimationContext)
  if (context === undefined) {
    throw new Error("useAnimation must be used within an AnimationProvider")
  }
  return context
}

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const [enableAnimations, setEnableAnimations] = useState(true)

  const isReducedMotion = prefersReducedMotion || !enableAnimations

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const toggleAnimations = () => {
    setEnableAnimations((prev) => !prev)
  }

  return (
    <AnimationContext.Provider
      value={{
        isReducedMotion,
        prefersReducedMotion,
        enableAnimations,
        toggleAnimations,
      }}
    >
      {children}
    </AnimationContext.Provider>
  )
}
