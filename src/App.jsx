import { useState, useEffect } from 'react';
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
import LogActivity from './components/LogActivity';
import ProfilePage from './components/ProfilePage';
import Community from './components/Community';
import Challenges from './components/Challenges';
import BackgroundAnimation from './components/BackgroundAnimation';
import './App.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// export const API_URL = import.meta.env.VITE_API_URL;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem('user');
      return null;
    }
  });
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'home';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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

  useEffect(() => {
    // Route protection: If on profile page and not logged in, redirect to home and open login
    if (currentPage === 'profile' && !user) {
      setCurrentPage('home');
      localStorage.setItem('currentPage', 'home');
      setAuthMode('login');
      setIsAuthModalOpen(true);
    }
  }, [currentPage, user]);

  useEffect(() => {
    // Sync state with browser history on popstate (back/forward button)
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        localStorage.setItem('currentPage', event.state.page);
      } else {
        // Default to home if no state (e.g., initial load or external link)
        setCurrentPage('home');
        localStorage.setItem('currentPage', 'home');
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initial replaceState to ensure current page is in history
    window.history.replaceState({ page: currentPage }, '', window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleNavigate = (page) => {
    // Protected routes check
    if (page === 'profile' && !user) {
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
    window.scrollTo(0, 0);

    // Push new state to history
    window.history.pushState({ page: page }, '', window.location.pathname);
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      if (!user || !user.email) {
        console.error("No user email found for update");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/update-profile-by-email/`, {
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
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans pt-16 transition-colors duration-300 relative">
        <BackgroundAnimation />
        <Header
          user={user}
          onLoginClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
          onRegisterClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          currentPage={currentPage}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        {currentPage === 'home' && <FloatingNav user={user} />}

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authMode}
          onLoginSuccess={handleLoginSuccess}
        />

        <main className={`flex-grow ${currentPage === 'community' ? '' : 'pt-6'}`}>
          {currentPage === 'home' ? (
            <>
              <div id="welcome"><QuotesSection onNavigate={handleNavigate} /></div>

              {user && (
                <div className="max-w-6xl mx-auto px-4 mb-12">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-teal-50 dark:border-gray-700 transition-colors duration-300">
                    <div id="impact-stats"><ImpactStats /></div>
                    <div className="my-12 border-t border-gray-100 dark:border-gray-700 transition-colors"></div>
                    <div id="recent-activities"><RecentActivities /></div>
                    <div className="my-12 border-t border-gray-100 dark:border-gray-700 transition-colors"></div>
                    <div id="daily-engagement"><DailyEngagement onNavigate={handleNavigate} /></div>
                  </div>
                </div>
              )}

              <div id="global-emissions"><EmissionsMap /></div>
              <div id="comparison"><ImpactSection /></div>
              <div id="community-stats"><CommunityImpactMap /></div>
              <div id="eco-champions"><EcoChampions /></div>
              <div id="live-actions"><LiveActions /></div>
              <div id="actionable-insights"><ActionableInsights /></div>
              <div id="emission-breakdown"><EmissionBreakdown /></div>
              <div id="country-comparison"><CountryComparison /></div>
            </>
          ) : currentPage === 'log-activity' ? (
            <LogActivity />
          ) : currentPage === 'community' ? (
            <Community />
          ) : currentPage === 'challenges' ? (
            <Challenges />
          ) : (
            <ProfilePage user={user} onUpdateProfile={handleUpdateProfile} isDarkMode={isDarkMode} onNavigate={handleNavigate} />
          )}
        </main>

        <Footer />
      </div >
    </QueryClientProvider>
  );
}

export default App
