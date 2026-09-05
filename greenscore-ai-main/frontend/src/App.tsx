import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AIAssistantModal } from './components/modals/AIAssistantModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { PublicDashboardPage } from './pages/PublicDashboardPage';
import { CitizenReportPage } from './pages/CitizenReportPage';
import { TrackReportPage } from './pages/TrackReportPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CityOverviewPage } from './pages/CityOverviewPage';
import { ZoneExplorerPage } from './pages/ZoneExplorerPage';
import { SustainabilityScorePage } from './pages/SustainabilityScorePage';
import { EnvironmentalIntelligencePage } from './pages/EnvironmentalIntelligencePage';
import { PredictionsPage } from './pages/PredictionsPage';
import { PriorityEnginePage } from './pages/PriorityEnginePage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { BudgetOptimizerPage } from './pages/BudgetOptimizerPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { ScenarioComparisonPage } from './pages/ScenarioComparisonPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { CitizenReportsAdminPage } from './pages/CitizenReportsAdminPage';
import { ActionManagementPage } from './pages/ActionManagementPage';
import { DepartmentManagementPage } from './pages/DepartmentManagementPage';
import { ProjectTrackingPage } from './pages/ProjectTrackingPage';
import { ImpactVerificationPage } from './pages/ImpactVerificationPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AssistantPage } from './pages/AssistantPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

const MainApp: React.FC = () => {
  const { role } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [pageParams, setPageParams] = useState<any>({});
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    if (params) setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPublicStandalone = currentPage === 'landing' || currentPage === 'login';

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (shown on internal dashboard pages) */}
        {!isPublicStandalone && (
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
          />
        )}

        {/* Dynamic Page Container */}
        <main className={`flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 ${!isPublicStandalone ? 'max-w-7xl mx-auto w-full' : ''}`}>
          {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
          {currentPage === 'public-dashboard' && <PublicDashboardPage onNavigate={handleNavigate} />}
          {currentPage === 'citizen-report' && <CitizenReportPage onNavigate={handleNavigate} />}
          {currentPage === 'track-report' && <TrackReportPage initialTrackingId={pageParams?.trackingId} onNavigate={handleNavigate} />}
          {currentPage === 'dashboard' && <AdminDashboardPage onNavigate={handleNavigate} onOpenAssistant={() => setIsAssistantOpen(true)} />}
          {currentPage === 'city-overview' && <CityOverviewPage onNavigate={handleNavigate} />}
          {currentPage === 'zones' && <ZoneExplorerPage initialZoneId={pageParams?.zoneId} onNavigate={handleNavigate} />}
          {currentPage === 'sustainability-score' && <SustainabilityScorePage onNavigate={handleNavigate} />}
          {currentPage === 'environmental-intel' && <EnvironmentalIntelligencePage onNavigate={handleNavigate} />}
          {currentPage === 'predictions' && <PredictionsPage onNavigate={handleNavigate} />}
          {currentPage === 'priority' && <PriorityEnginePage onNavigate={handleNavigate} />}
          {currentPage === 'recommendations' && <RecommendationsPage initialProblemId={pageParams?.problemId} onNavigate={handleNavigate} />}
          {currentPage === 'budget' && <BudgetOptimizerPage onNavigate={handleNavigate} />}
          {currentPage === 'simulation' && <WhatIfSimulatorPage initialZoneId={pageParams?.zoneId} onNavigate={handleNavigate} />}
          {currentPage === 'scenario-comparison' && <ScenarioComparisonPage onNavigate={handleNavigate} />}
          {currentPage === 'digital-twin' && <DigitalTwinPage onNavigate={handleNavigate} />}
          {currentPage === 'citizen-reports-admin' && <CitizenReportsAdminPage onNavigate={handleNavigate} />}
          {currentPage === 'actions' && <ActionManagementPage onNavigate={handleNavigate} />}
          {currentPage === 'departments' && <DepartmentManagementPage onNavigate={handleNavigate} />}
          {currentPage === 'projects' && <ProjectTrackingPage onNavigate={handleNavigate} />}
          {currentPage === 'impact' && <ImpactVerificationPage onNavigate={handleNavigate} />}
          {currentPage === 'alerts' && <AlertsPage onNavigate={handleNavigate} />}
          {currentPage === 'reports' && <ReportsPage onNavigate={handleNavigate} />}
          {currentPage === 'assistant' && <AssistantPage />}
          {currentPage === 'users' && <UserManagementPage />}
          {currentPage === 'audit' && <AuditLogsPage />}
          {currentPage === 'settings' && <SettingsPage />}
          {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
        </main>
      </div>

      {/* Global AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
