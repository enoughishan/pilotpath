import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastProvider } from './components/ui/Toast.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { useSession } from './store/useSession.js';
import { can } from './utils/perms.js';

import SignIn from './pages/SignIn.jsx';
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
import EvidenceRepository from './pages/EvidenceRepository.jsx';
import Analytics from './pages/Analytics.jsx';
import PublicValuePage from './pages/PublicValuePage.jsx';
import Templates from './pages/Templates.jsx';
import Audit from './pages/Audit.jsx';
import Settings from './pages/Settings.jsx';

/* Protected route — must be authenticated */
function Protected({ children }) {
  const authenticated = useSession(s => s.authenticated);
  const location = useLocation();
  if (!authenticated) return <Navigate to="/signin" state={{ from: location }} replace />;
  return children;
}

/* Role-gated route — must have permission for the given key */
function Gated({ children, permKey }) {
  const role = useSession(s => s.role);
  if (permKey && !can(role, permKey)) {
    return (
      <div className="content">
        <div className="empty" style={{ padding: 80 }}>
          <b>Access restricted</b>
          <p>Your role does not have permission to view this section.</p>
        </div>
      </div>
    );
  }
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
        <Route path="/signin" element={<SignIn />} />

        <Route element={<Protected><AppShell /></Protected>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pathway" element={<Gated permKey="pathway"><PathwayBoard /></Gated>} />
          <Route path="/challenges" element={<Gated permKey="challenges"><Challenges /></Gated>} />
          <Route path="/challenges/new" element={<Gated permKey="challenges"><NewChallenge /></Gated>} />
          <Route path="/challenges/:id" element={<Gated permKey="challenges"><ChallengeDetail /></Gated>} />
          <Route path="/startups" element={<Gated permKey="startups"><Startups /></Gated>} />
          <Route path="/startups/:id" element={<Gated permKey="startups"><StartupDetail /></Gated>} />
          <Route path="/evaluations" element={<Gated permKey="evaluations"><Evaluations /></Gated>} />
          <Route path="/pilots" element={<Gated permKey="pilots"><Pilots /></Gated>} />
          <Route path="/pilots/:id" element={<Gated permKey="pilots"><PilotDetail /></Gated>} />
          <Route path="/contracts" element={<Gated permKey="contracts"><Contracts /></Gated>} />
          <Route path="/contracts/:id" element={<Gated permKey="contracts"><ContractDetail /></Gated>} />
          <Route path="/monitoring" element={<Gated permKey="monitoring"><Monitoring /></Gated>} />
          <Route path="/payments" element={<Gated permKey="payments"><Payments /></Gated>} />
          <Route path="/validation" element={<Gated permKey="validation"><Validation /></Gated>} />
          <Route path="/scaleup" element={<Gated permKey="scaleup"><ScaleUp /></Gated>} />
          <Route path="/evidence" element={<Gated permKey="evidence"><EvidenceRepository /></Gated>} />
          <Route path="/analytics" element={<Gated permKey="analytics"><Analytics /></Gated>} />
          <Route path="/publicvalue" element={<Gated permKey="publicvalue"><PublicValuePage /></Gated>} />
          <Route path="/templates" element={<Gated permKey="templates"><Templates /></Gated>} />
          <Route path="/audit" element={<Gated permKey="audit"><Audit /></Gated>} />
          <Route path="/settings" element={<Gated permKey="settings"><Settings /></Gated>} />
        </Route>

        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </ToastProvider>
  );
}