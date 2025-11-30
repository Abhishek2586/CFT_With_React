import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import QuotesSection from './components/QuotesSection';
import EmissionsMap from './components/EmissionsMap';
import './App.css'

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header onLoginClick={openLogin} onRegisterClick={openRegister} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      <main className="flex-grow">
        <QuotesSection />
        <EmissionsMap />
      </main>
      <Footer />
    </div>
  )
}

export default App
