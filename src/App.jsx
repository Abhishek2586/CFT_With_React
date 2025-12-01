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
import ProfilePage from './components/ProfilePage';
import './App.css'

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'home';
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
    setCurrentPage('home');
    localStorage.setItem('currentPage', 'home');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
    window.scrollTo(0, 0);
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      if (!user || !user.email) {
        console.error("No user email found for update");
        return;
      }

      const response = await fetch(`${API_URL}/update-profile-by-email/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          profile: updatedData
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Update local user state with the data returned from backend
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        console.error("Backend update failed");
        // Fallback for demo: still update local state so user sees changes
        setUser(prevUser => {
          const newUser = {
            ...prevUser,
            profile: {
              ...prevUser.profile,
              ...updatedData
            }
          };
          localStorage.setItem('user', JSON.stringify(newUser));
          return newUser;
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Fallback for demo
      setUser(prevUser => {
        const newUser = {
          ...prevUser,
          profile: {
            ...prevUser.profile,
            ...updatedData
          }
        };
        localStorage.setItem('user', JSON.stringify(newUser));
        return newUser;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pt-16">
      <Header
        user={user}
        onLoginClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
        onRegisterClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      {currentPage === 'home' && <FloatingNav user={user} />}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />

      <main className="flex-grow pt-6">
        {currentPage === 'home' ? (
          <>
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
            <div id="community-stats"><CommunityImpactMap /></div>
            <div id="heatmap"><EcoChampions /></div>
            <div id="leaderboard"><LiveActions /></div>
            <div id="live-feed"><ActionableInsights /></div>
            <div id="insights"><EmissionBreakdown /></div>
            <div id="breakdown"><CountryComparison /></div>
            <div id="comparison"><ImpactSection /></div>
          </>
        ) : (
          <ProfilePage user={user} onUpdateProfile={handleUpdateProfile} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App
