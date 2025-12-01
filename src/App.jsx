import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import QuotesSection from './components/QuotesSection';
import EmissionsMap from './components/EmissionsMap';
import ImpactSection from './components/ImpactSection';
import CommunityImpactMap from './components/CommunityImpactMap';
import EcoChampions from './components/EcoChampions';
import LiveActions from './components/LiveActions';
import ActionableInsights from './components/ActionableInsights';
import EmissionBreakdown from './components/EmissionBreakdown';
import CountryComparison from './components/CountryComparison';
import FloatingNav from './components/FloatingNav';
import ImpactStats from './components/ImpactStats';
import RecentActivities from './components/RecentActivities';
import DailyEngagement from './components/DailyEngagement';
import './App.css'

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pt-16">
      <Header
        user={user}
        onLoginClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
        onRegisterClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
        onLogout={handleLogout}
      />

      <FloatingNav user={user} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />

      <main className="flex-grow pt-6">
        <div id="welcome"><QuotesSection /></div>

        {user && (
          <div className="max-w-6xl mx-auto px-4 mb-12">
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-teal-50">
              <div id="impact-stats"><ImpactStats /></div>
              <div className="my-12 border-t border-gray-100"></div>
              <div id="recent-activities"><RecentActivities /></div>
              <div className="my-12 border-t border-gray-100"></div>
              <div id="daily-engagement"><DailyEngagement /></div>
            </div>
          </div>
        )}

        <div id="global-emissions"><EmissionsMap /></div>
        <div id="community-stats"><ImpactSection /></div>
        <div id="heatmap"><CommunityImpactMap /></div>
        <div id="leaderboard"><EcoChampions /></div>
        <div id="live-feed"><LiveActions /></div>
        <div id="insights"><ActionableInsights /></div>
        <div id="breakdown"><EmissionBreakdown /></div>
        <div id="comparison"><CountryComparison /></div>
      </main>
      <Footer />
    </div>
  )
}

export default App
