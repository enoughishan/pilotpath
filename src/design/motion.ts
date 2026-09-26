import { useReducedMotion } from 'framer-motion'

export const transitionFast = { duration: 0.12, ease: [0.2, 0, 0, 1] }
export const transitionExpand = { duration: 0.20, ease: [0.2, 0, 0, 1] }
export const transitionDialog = { duration: 0.28, ease: [0.2, 0, 0, 1] }

export function useMotionProps<T extends Record<string, unknown>>(
  normalProps: T,
  reducedProps?: T
): T {
  const shouldReduce = useReducedMotion()
  if (shouldReduce) {
    return reducedProps ?? ({ opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0 } } as unknown as T)
  }
  return normalProps
}
