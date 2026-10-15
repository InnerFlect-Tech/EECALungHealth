import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ScrollManager } from './components/ScrollManager';
import { I18nProvider } from './i18n/I18nProvider';
import { HomePage } from './pages/HomePage';
import { SolutionPage } from './pages/SolutionPage';
import { TeamPage } from './pages/TeamPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminResponseDetailPage } from './pages/admin/AdminResponseDetailPage';
import { AudiencePage } from './pages/AudiencePage';
import { ContactPage } from './pages/ContactPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
// Review-only: these three pages are not linked from anywhere and still carry
// claims that are not true yet (live pilots, committed co-funding). They are
// mounted behind import.meta.env.DEV so they can be read locally but cannot
// reach the production bundle's route table.
import { PartnersFoundationsPage } from './pages/partners/PartnersFoundationsPage';
import { PartnersTechPage } from './pages/partners/PartnersTechPage';
import { PartnersTargetsPage } from './pages/partners/PartnersTargetsPage';
import { LegalPage } from './pages/LegalPage';
import { ForFundersPage } from './pages/ForFundersPage';
import { ConceptNotePage } from './pages/ConceptNotePage';
import { GovernanceFinancialsPage } from './pages/GovernanceFinancialsPage';
import { FunderFitPage } from './pages/FunderFitPage';

// Unlinked audit page – loaded on demand so marked/mermaid stay out of the main bundle.
const MeetingQuestionsPage = lazy(() => import('./pages/MeetingQuestionsPage').then((m) => ({ default: m.MeetingQuestionsPage })));
const DesignDirectionsPage = lazy(() => import('./pages/DesignDirectionsPage').then((m) => ({ default: m.DesignDirectionsPage })));
const AuditPage = lazy(() => import('./pages/AuditPage').then((m) => ({ default: m.AuditPage })));
const CareContinuityDemoPage = lazy(() => import('./pages/CareContinuityDemoPage').then((m) => ({ default: m.CareContinuityDemoPage })));

const ParliamentaryDemoPage = lazy(() => import('./pages/ParliamentaryDemoPage'));

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/solution" element={<SolutionPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/consultation/funder" element={<FunderFitPage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/responses/:id" element={<AdminResponseDetailPage />} />
          {/* Audience pages */}
          <Route path="/policymakers" element={<AudiencePage audience="policymakers" />} />
          <Route path="/partners" element={<AudiencePage audience="partners" />} />
          <Route path="/civil-society" element={<AudiencePage audience="civil-society" />} />
          <Route path="/donors" element={<Navigate to="/partners" replace />} />
          <Route path="/for-funders" element={<ForFundersPage />} />
          <Route path="/concept-note" element={<ConceptNotePage />} />
          <Route path="/governance/financials" element={<GovernanceFinancialsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/audit/2026-10-15" element={<Suspense fallback={null}><AuditPage /></Suspense>} />
          <Route path="/demo/parliamentary-intelligence" element={<Suspense fallback={<div style={{ minHeight: '100vh' }} />}><ParliamentaryDemoPage /></Suspense>} />
          <Route path="/demo/design-directions" element={<Suspense fallback={null}><DesignDirectionsPage /></Suspense>} />
          <Route path="/meeting/2026-10-15" element={<Suspense fallback={null}><MeetingQuestionsPage /></Suspense>} />
          <Route path="/demo/care-continuity" element={<Suspense fallback={null}><CareContinuityDemoPage /></Suspense>} />
          {/* Internal design-system reference (noindex) */}
          <Route path="/design" element={<DesignSystemPage />} />
          {/* Unlinked partner drafts — local review only, never in production */}
          {import.meta.env.DEV && (
            <>
              <Route path="/partners/foundations" element={<PartnersFoundationsPage />} />
              <Route path="/partners/tech" element={<PartnersTechPage />} />
              <Route path="/partners/targets" element={<PartnersTargetsPage />} />
            </>
          )}
          {/* Legal */}
          <Route path="/privacy" element={<LegalPage doc="privacy" />} />
          <Route path="/terms" element={<LegalPage doc="terms" />} />
          <Route path="/disclaimer" element={<LegalPage doc="disclaimer" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}
