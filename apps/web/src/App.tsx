import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { usePageMeta } from './hooks/usePageMeta';
import { RewardsClubHubPage } from './pages/club/RewardsClubHubPage';
import { CoinsWalletPage } from './pages/club/CoinsWalletPage';
import { ReferralsPage } from './pages/club/ReferralsPage';
import { ScratchCardPage } from './pages/club/ScratchCardPage';
import { BirthdayRewardsPage } from './pages/club/BirthdayRewardsPage';
import { CustomerLoginPage } from './pages/CustomerLoginPage';
import { SpinPage } from './pages/SpinPage';
import { VerifyPage } from './pages/VerifyPage';
import { RewardsPage } from './pages/RewardsPage';
import { RewardDetailPage } from './pages/RewardDetailPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ContactPage } from './pages/ContactPage';
import { InstagramPage } from './pages/InstagramPage';
import { TermsPage, PrivacyPage } from './pages/LegalPages';
import { SupabaseTodosPage } from './pages/SupabaseTodosPage';
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminDashboard } from './admin/AdminDashboard';
import { ThemeProvider } from './context/ThemeContext';

// Protected Admin Route Guard
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('bingooo_admin_token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  usePageMeta();

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen transition-colors duration-300">
        <Routes>
          {/* Admin Routes without Public Navbar/Footer */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* Public Routes with Branded Navbar and Footer */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<RewardsClubHubPage />} />
                    <Route path="/club" element={<RewardsClubHubPage />} />
                    <Route path="/club/wallet" element={<CoinsWalletPage />} />
                    <Route path="/club/refer" element={<ReferralsPage />} />
                    <Route path="/club/scratch" element={<ScratchCardPage />} />
                    <Route path="/scratch" element={<ScratchCardPage />} />
                    <Route path="/club/check-in" element={<Navigate to="/club/scratch" replace />} />
                    <Route path="/club/birthday" element={<BirthdayRewardsPage />} />
                    <Route path="/spin" element={<SpinPage />} />
                    <Route path="/login" element={<CustomerLoginPage />} />
                    <Route path="/verify" element={<CustomerLoginPage />} />
                    <Route path="/rewards" element={<RewardsPage />} />
                    <Route path="/reward/:code" element={<RewardDetailPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/instagram" element={<InstagramPage />} />
                    <Route path="/reels" element={<InstagramPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/todos" element={<SupabaseTodosPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
