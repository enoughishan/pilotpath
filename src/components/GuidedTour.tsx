import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, Compass } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface TourStep {
  target: string // data-tour attribute value
  titleKey: string
  bodyKey: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const TOUR_STEPS: TourStep[] = [
  {
    target: 'landing-hero',
    titleKey: 'tour.step1Title',
    bodyKey: 'tour.step1Body',
    placement: 'bottom',
  },
  {
    target: 'pathway-board',
    titleKey: 'tour.step2Title',
    bodyKey: 'tour.step2Body',
    placement: 'bottom',
  },
  {
    target: 'challenge-builder',
    titleKey: 'tour.step3Title',
    bodyKey: 'tour.step3Body',
    placement: 'right',
  },
  {
    target: 'discovery-matching',
    titleKey: 'tour.step4Title',
    bodyKey: 'tour.step4Body',
    placement: 'right',
  },
  {
    target: 'screening-rules',
    titleKey: 'tour.step5Title',
    bodyKey: 'tour.step5Body',
    placement: 'right',
  },
  {
    target: 'evaluator-workspace',
    titleKey: 'tour.step6Title',
    bodyKey: 'tour.step6Body',
    placement: 'left',
  },
  {
    target: 'score-matrix-review',
    titleKey: 'tour.step7Title',
    bodyKey: 'tour.step7Body',
    placement: 'bottom',
  },
  {
    target: 'payment-sla',
    titleKey: 'tour.step8Title',
    bodyKey: 'tour.step8Body',
    placement: 'left',
  },
]

const TOUR_KEY = 'pilotbridge_tour_step'

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

function getRect(el: Element): Rect {
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

function computePopoverPosition(rect: Rect, placement: TourStep['placement'] = 'bottom') {
  const PAD = 16
  const PW = 340

  let top = 0
  let left = 0

  switch (placement) {
    case 'bottom':
      top = rect.top + rect.height + PAD
      left = rect.left + rect.width / 2 - PW / 2
      break
    case 'top':
      top = rect.top - PAD - 240
      left = rect.left + rect.width / 2 - PW / 2
      break
    case 'left':
      top = rect.top + rect.height / 2 - 100
      left = rect.left - PW - PAD
      break
    case 'right':
      top = rect.top + rect.height / 2 - 100
      left = rect.left + rect.width + PAD
      break
  }

  // Clamp to viewport
  left = Math.max(PAD, Math.min(left, window.innerWidth - PW - PAD))
  top = Math.max(PAD, top)

  return { top, left }
}

interface GuidedTourProps {
  isActive: boolean
  onClose: () => void
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ isActive, onClose }) => {
  const { t } = useTranslation()
  const [stepIndex, setStepIndex] = useState(() => {
    const saved = sessionStorage.getItem(TOUR_KEY)
    return saved ? parseInt(saved, 10) : 0
  })
  const [targetRect, setTargetRect] = useState<Rect | null>(null)
  const rafRef = useRef<number | null>(null)

  const currentStep = TOUR_STEPS[stepIndex]

  const findTarget = useCallback(() => {
    if (!isActive || !currentStep) return
    const el = document.querySelector(`[data-tour="${currentStep.target}"]`)
    if (el) {
      setTargetRect(getRect(el))
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    } else {
      setTargetRect(null)
    }
  }, [isActive, currentStep])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(findTarget)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [findTarget])

  useEffect(() => {
    if (isActive) {
      sessionStorage.setItem(TOUR_KEY, String(stepIndex))
    }
  }, [isActive, stepIndex])

  const handleNext = () => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex((s) => s + 1)
    } else {
      handleClose()
    }
  }

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex((s) => s - 1)
  }

  const handleClose = () => {
    sessionStorage.removeItem(TOUR_KEY)
    onClose()
  }

  if (!isActive) return null

  const pos = targetRect ? computePopoverPosition(targetRect, currentStep.placement) : { top: window.innerHeight / 2 - 120, left: window.innerWidth / 2 - 170 }

  const stepTitle = t(currentStep.titleKey)
  const stepBody = t(currentStep.bodyKey)

  return createPortal(
    <>
      {/* Dark overlay with spotlight cutout */}
      <div
        className="fixed inset-0 z-[9998] pointer-events-none"
        style={{
          background: targetRect
            ? `radial-gradient(ellipse ${targetRect.width + 32}px ${targetRect.height + 32}px at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent 0%, rgba(0,0,0,0.55) 100%)`
            : 'rgba(0,0,0,0.55)',
        }}
      />

      {/* Highlight ring */}
      {targetRect && (
        <motion.div
          key={currentStep.target}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-[9999] pointer-events-none rounded-[8px]"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            boxShadow: '0 0 0 3px var(--primary), 0 0 0 6px rgba(23,83,155,0.18)',
          }}
        />
      )}

      {/* Popover */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="fixed z-[10000] w-[340px] bg-[var(--surface)] border border-[var(--line-strong)] rounded-[var(--radius-md)] shadow-xl overflow-hidden"
          style={{ top: pos.top, left: pos.left }}
          role="dialog"
          aria-modal="true"
          aria-label={`Tour step ${stepIndex + 1} of ${TOUR_STEPS.length}: ${stepTitle}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-[11px] font-bold text-[var(--primary)] font-heading">
                {t('tour.label')} · {stepIndex + 1}/{TOUR_STEPS.length}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded hover:bg-[var(--sunken)] text-[var(--ink-3)] transition-colors cursor-pointer"
              aria-label="Close tour"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mx-4 h-[3px] rounded-full bg-[var(--sunken)] overflow-hidden">
            <motion.div
              className="h-full bg-[var(--primary)] rounded-full"
              initial={{ width: `${(stepIndex / TOUR_STEPS.length) * 100}%` }}
              animate={{ width: `${((stepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Body */}
          <div className="px-4 py-3 space-y-1">
            <h3 className="font-heading font-bold text-[15px] text-[var(--ink)]">{stepTitle}</h3>
            <p className="text-[13px] text-[var(--ink-2)] leading-relaxed">{stepBody}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 pb-4 pt-1">
            <button
              onClick={handleClose}
              className="text-[12px] text-[var(--ink-3)] hover:text-[var(--ink)] cursor-pointer"
            >
              {t('tour.skip')}
            </button>
            <div className="flex items-center space-x-2">
              {stepIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs rounded-[var(--radius-sm)] border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--sunken)] cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>{t('tour.back')}</span>
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs rounded-[var(--radius-sm)] bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)] cursor-pointer font-semibold"
              >
                <span>{stepIndex < TOUR_STEPS.length - 1 ? t('tour.next') : t('tour.finish')}</span>
                {stepIndex < TOUR_STEPS.length - 1 && <ArrowRight className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>,
    document.body
  )
}
