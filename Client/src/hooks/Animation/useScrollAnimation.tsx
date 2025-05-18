
import { useEffect, useState, useRef, type RefObject } from "react"
import { useAnimation } from "../../context/Animation/AnimationContext"

type ScrollAnimationOptions = {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollAnimation<T extends HTMLElement>(
  options: ScrollAnimationOptions = {},
): [RefObject<T | null>, boolean] {
  const { isReducedMotion } = useAnimation()
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<T>(null)
  const { threshold = 0.1, rootMargin = "0px", once = true } = options

  useEffect(() => {
    // If user prefers reduced motion, immediately set visible
    if (isReducedMotion) {
      setIsVisible(true)
      return
    }

    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            setIsVisible(false)
          }
        })
      },
      { threshold, rootMargin },
    )

    observer.observe(currentRef)

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin, once, isReducedMotion])

  return [ref, isVisible]
}
