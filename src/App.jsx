import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { useSession } from './store/useSession.js';
import { useEffect } from 'react';

import RoleSelect from './pages/RoleSelect.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PathwayBoard from './pages/PathwayBoard.jsx';
import Challenges from './pages/Challenges.jsx';
import ChallengeDetail from './pages/ChallengeDetail.jsx';
import NewChallenge from './pages/NewChallenge.jsx';
import Startups from './pages/Startups.jsx';
import StartupDetail from './pages/StartupDetail.jsx';
import Evaluations from './pages/Evaluations.jsx';
import Pilots from './pages/Pilots.jsx';
import PilotDetail from './pages/PilotDetail.jsx';
import Contracts from './pages/Contracts.jsx';
import ContractDetail from './pages/ContractDetail.jsx';
import Monitoring from './pages/Monitoring.jsx';
import Payments from './pages/Payments.jsx';
import Validation from './pages/Validation.jsx';
import ScaleUp from './pages/ScaleUp.jsx';
import EvidenceVault from './pages/EvidenceVault.jsx';
import Analytics from './pages/Analytics.jsx';
import PublicValuePage from './pages/PublicValuePage.jsx';
import Templates from './pages/Templates.jsx';
import Audit from './pages/Audit.jsx';
import Settings from './pages/Settings.jsx';

function ProtectedRoute({ children }) {
  const role = useSession(s => s.role);
  if (!role) return <Navigate to="/role-select" replace />;
  return children;
}

export default function App() {
  const theme = useSession(s => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ToastProvider>
      <Routes>
        <Route path="/role-select" element={<RoleSelect />} />

        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pathway" element={<PathwayBoard />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenges/new" element={<NewChallenge />} />
          <Route path="/challenges/:id" element={<ChallengeDetail />} />
          <Route path="/startups" element={<Startups />} />
          <Route path="/startups/:id" element={<StartupDetail />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/pilots" element={<Pilots />} />
          <Route path="/pilots/:id" element={<PilotDetail />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/contracts/:id" element={<ContractDetail />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/validation" element={<Validation />} />
          <Route path="/scaleup" element={<ScaleUp />} />
          <Route path="/evidence" element={<EvidenceVault />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/publicvalue" element={<PublicValuePage />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/" element={<Navigate to="/role-select" replace />} />
        <Route path="*" element={<Navigate to="/role-select" replace />} />
      </Routes>
    </ToastProvider>
  );
}