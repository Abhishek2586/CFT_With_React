import { useState } from 'react';
import Logo from './Logo';

const Header = ({ onLoginClick, onRegisterClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-teal-500 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <Logo className="w-8 h-8 text-white" />
                    <span className="text-2xl font-bold tracking-tight">ecoTracker</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8 items-center">
                    <a href="#" className="hover:text-teal-100 transition-colors font-medium">Dashboard</a>
                    <a href="#" className="hover:text-teal-100 transition-colors font-medium">Profile</a>
                    <a href="#" className="hover:text-teal-100 transition-colors font-medium">Community</a>
                    <a href="#" className="hover:text-teal-100 transition-colors font-medium">Challenge</a>
                </nav>

                {/* Auth Buttons */}
                <div className="hidden md:flex space-x-4 items-center">
                    <button
                        onClick={onLoginClick}
                        className="hover:text-teal-100 font-medium"
                    >
                        Login
                    </button>
                    <button
                        onClick={onRegisterClick}
                        className="bg-white text-teal-600 px-4 py-2 rounded-full font-semibold hover:bg-teal-50 transition-colors shadow-sm"
                    >
                        Register
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-teal-600 pb-4 px-4 pt-2 space-y-2">
                    <a href="#" className="block py-2 hover:bg-teal-700 rounded px-2">Dashboard</a>
                    <a href="#" className="block py-2 hover:bg-teal-700 rounded px-2">Profile</a>
                    <a href="#" className="block py-2 hover:bg-teal-700 rounded px-2">Community</a>
                    <a href="#" className="block py-2 hover:bg-teal-700 rounded px-2">Challenge</a>
                    <div className="border-t border-teal-500 pt-2 mt-2 flex flex-col space-y-2">
                        <button
                            onClick={() => {
                                onLoginClick();
                                setIsMenuOpen(false);
                            }}
                            className="text-left py-2 hover:bg-teal-700 rounded px-2"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                onRegisterClick();
                                setIsMenuOpen(false);
                            }}
                            className="bg-white text-teal-600 py-2 rounded font-semibold text-center"
                        >
                            Register
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
