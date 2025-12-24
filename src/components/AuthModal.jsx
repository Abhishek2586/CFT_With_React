import { useState, useEffect } from 'react';
import Logo from './Logo';
import authBg from '../assets/auth-bg-new.jpg';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', onLoginSuccess }) => {
    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setFormData({ username: '', email: '', password: '' });
            setError('');
            setSuccess('');
            setOtp('');
            setOtpSent(false);
            setIsVerified(false);
        }
    }, [initialMode, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOTP = async () => {
        if (!formData.email) {
            setError("Please enter your email first.");
            return;
        }
        setError('');
        try {
            const res = await fetch('http://127.0.0.1:8000/api/auth/send-otp/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            const data = await res.json();
            if (res.ok) {
                setOtpSent(true);
                setSuccess("OTP sent to your email!");
            } else {
                setError(data.error || "Failed to send OTP.");
            }
        } catch (e) {
            setError("Failed to connect for OTP.");
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp) {
            setError("Please enter the OTP.");
            return;
        }
        setError('');
        try {
            const res = await fetch('http://127.0.0.1:8000/api/auth/verify-otp/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp })
            });
            const data = await res.json();
            if (res.ok) {
                setIsVerified(true);
                setSuccess("Email verified! You can now sign up.");
            } else {
                setError(data.error || "Invalid OTP.");
            }
        } catch (e) {
            setError("Failed to verify OTP.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const url = mode === 'login'
            ? 'http://127.0.0.1:8000/api/login/'
            : 'http://127.0.0.1:8000/api/register/';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {
                setSuccess(mode === 'login' ? 'Login successful!' : 'Registration successful! Please login.');
                if (mode === 'register') {
                    // Automatically log in after register or switch to login?
                    // For now, let's just switch to login as per previous logic
                    setTimeout(() => setMode('login'), 1500);
                } else {
                    // Handle login success
                    console.log('Token:', data.token);
                    if (onLoginSuccess) {
                        // Combine user data with token if needed, or just pass user object
                        // The backend returns { token: "...", user: { ... } }
                        onLoginSuccess(data.user);
                    }
                    setTimeout(onClose, 1500);
                }
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative flex min-h-[600px] transition-colors duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 z-10 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left Side - Illustration (Background Image) */}
                <div className="hidden md:block w-1/2 relative bg-teal-50 dark:bg-teal-900 transition-colors">
                    <img
                        src={authBg}
                        alt="Eco Friendly"
                        className="absolute inset-0 w-full h-full object-contain object-center"
                    />
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Logo className="w-10 h-10 text-teal-600 dark:text-teal-400 transition-colors" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">
                            {mode === 'login' ? 'Login into account' : 'Create an account'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 transition-colors">
                            {mode === 'login'
                                ? 'Use your credentials to access your account.'
                                : 'Join us in making the world a greener place.'}
                        </p>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm text-center">{error}</div>}
                    {success && <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm text-center">{success}</div>}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {mode === 'register' && (
                            <div>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isVerified}
                                className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 ${isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                                required
                            />
                            {mode === 'register' && !isVerified && formData.email && (
                                <button
                                    type="button"
                                    onClick={handleSendOTP}
                                    disabled={otpSent}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-teal-500 hover:bg-teal-600 text-white px-2 py-1 rounded transition-colors disabled:opacity-50"
                                >
                                    {otpSent ? 'OTP Sent' : 'Send OTP'}
                                </button>
                            )}
                            {isVerified && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </span>
                            )}
                        </div>

                        {mode === 'register' && otpSent && !isVerified && (
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Enter 4-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={4}
                                    className="flex-1 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyOTP}
                                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Verify
                                </button>
                            </div>
                        )}

                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                required
                            />
                        </div>

                        {mode === 'login' && (
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center text-gray-500 dark:text-gray-400 cursor-pointer">
                                    <input type="checkbox" className="mr-2 rounded text-teal-600 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600" />
                                    Remember me
                                </label>
                                <a href="#" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors">Lost password?</a>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={mode === 'register' && !isVerified}
                            className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-teal-500/30 ${mode === 'register' && !isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {mode === 'login' ? 'Sign in' : 'Sign up'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 transition-colors">or login with</p>
                        <div className="flex justify-center space-x-4">
                            <button className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                            </button>
                            <button className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                            </button>
                            <button className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
