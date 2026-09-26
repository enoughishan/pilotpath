import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './i18n'
import { initMockBackend } from '@/mock/browser'
import { AppLayout } from '@/app/Layout'
import { LandingPage } from '@/features/public/LandingPage'
import { PathwayBoard } from '@/features/challenges/PathwayBoard'
import { ChallengeBuilder } from '@/features/challenges/ChallengeBuilder'
import { ChallengeWorkspace } from '@/features/challenges/ChallengeWorkspace'
import { EvaluatorWorkspace } from '@/features/evaluation/EvaluatorWorkspace'
import { FinancePaymentsWorkspace } from '@/features/payments/FinancePaymentsWorkspace'
import { ValidatorWorkspace } from '@/features/validation/ValidatorWorkspace'
import { StartupPortalHome } from '@/features/startup-portal/StartupPortalHome'
import { TemplateLibrary } from '@/features/templates/TemplateLibrary'
import { PublicTransparencyPage } from '@/features/public/PublicTransparencyPage'
import { AdminRulesRubricsPage } from '@/features/admin/AdminRulesRubricsPage'
import { ComponentGallery } from '@/features/dev/ComponentGallery'

export const App: React.FC = () => {
  useEffect(() => {
    initMockBackend()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* S1 Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Routes */}
        <Route path="/public" element={<PublicTransparencyPage />} />
        <Route path="/public/demand" element={<PublicTransparencyPage />} />

        {/* Application Shell Routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route path="pathway" element={<PathwayBoard />} />
          <Route path="challenges/new" element={<ChallengeBuilder />} />
          <Route path="challenges/:id" element={<ChallengeWorkspace />} />
          <Route path="documents" element={<TemplateLibrary />} />
          <Route path="demand" element={<PublicTransparencyPage />} />

          {/* Role Routes */}
          <Route path="evaluator/queue" element={<EvaluatorWorkspace />} />
          <Route path="evaluator/score/:applicationId" element={<EvaluatorWorkspace />} />
          <Route path="finance/payments" element={<FinancePaymentsWorkspace />} />
          <Route path="validator/assignments" element={<ValidatorWorkspace />} />
          <Route path="startup/home" element={<StartupPortalHome />} />
          <Route path="startup/opportunities" element={<StartupPortalHome />} />
          <Route path="startup/payments" element={<FinancePaymentsWorkspace />} />
          <Route path="admin/overview" element={<AdminRulesRubricsPage />} />
          <Route path="admin/rules" element={<AdminRulesRubricsPage />} />
          <Route path="admin/rubrics" element={<AdminRulesRubricsPage />} />

          <Route path="" element={<Navigate to="/app/pathway" replace />} />
        </Route>

        {/* Hidden Dev Gallery */}
        <Route path="/dev/components" element={<ComponentGallery />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
