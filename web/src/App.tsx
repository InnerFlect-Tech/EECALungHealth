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
import { LegalPage } from './pages/LegalPage';
import { ForFundersPage } from './pages/ForFundersPage';
import { ConceptNotePage } from './pages/ConceptNotePage';
import { GovernanceFinancialsPage } from './pages/GovernanceFinancialsPage';
import { FunderFitPage } from './pages/FunderFitPage';

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
          {/* Internal design-system reference (noindex) */}
          <Route path="/design" element={<DesignSystemPage />} />
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
