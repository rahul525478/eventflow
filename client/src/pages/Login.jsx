import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, Upload, X, Mail, Phone, ArrowRight, Lock, Smartphone, User } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';
import Button from '../components/ui/Button';

const Login = () => {
    const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
    const [step, setStep] = useState('form'); // 'form' or 'verify'
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Keep useLocation as it's used for Google callback

    // Form States
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        profileImage: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [otp, setOtp] = useState('');

    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [demoOtp, setDemoOtp] = useState(null);

    // Reset when switching modes
    useEffect(() => {
        setError(null);
        setStep('form');
        setOtp('');
        setDemoOtp(null);
    }, [mode]);

    // Handle Google Login Callback
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const role = params.get('role');
        const error = params.get('error');

        if (token) {
            // Ideally we should fetch user details here using the token,
            // or pass user details in params (less secure).
            // For now, we'll construct a basic user object or fetch it.
            // Let's decode or just set basic info.
            // Since we trust the token from our backend:
            const user = { role: role || 'participant' };
            // In a better flow, we'd hit /api/auth/me using the token to get full user details.
            // But let's stick to the current pattern.
            // We need to fetch the real user data to fill the context properly.

            fetch(`${API_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(userData => {
                    login(userData, token);
                    navigate('/');
                })
                .catch(err => {
                    // Fallback if /me endpoint doesn't exist yet (it might not)
                    // We'll trust the token and role for now, but this is temporary.
                    console.warn("Could not fetch user details, using fallback", err);
                    // We need to decode the token to get the user ID at least?
                    // Or just redirect.
                    login({ role: role || 'participant', name: 'Google User' }, token);
                    navigate('/');
                });
        }
    }, [location, login, navigate]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle file upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profileImage: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // SUBMIT: Sign In
    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // SUBMIT: Sign Up (Form -> OTP)
    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // FormData for file upload
        const data = new FormData();
        data.append('firstName', formData.firstName);
        data.append('lastName', formData.lastName);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('password', formData.password);
        if (formData.profileImage) {
            data.append('profileImage', formData.profileImage);
        }

        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    // Remove Content-Type header to let browser set boundary for multipart
                },
                body: data
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Signup failed');

            if (result.otp) {
                alert(`Your Confirmation OTP is: ${result.otp}`);
                setDemoOtp(result.otp);
            }
            setStep('verify');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // SUBMIT: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/auth/signup/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: formData.phone,
                    otp
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Verification failed');

            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Forgot Password States
    const [showForgotPwd, setShowForgotPwd] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetStep, setResetStep] = useState('email'); // email -> code -> newpass
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Mock API call for now, can implement real one later or if requested
        setTimeout(() => {
            alert(`Password reset code sent to ${resetEmail} (Mock: 123456)`);
            setResetStep('code');
            setLoading(false);
        }, 1000);
    };

    const handleResetConfirm = (e) => {
        e.preventDefault();
        setLoading(true);
        // Mock verification
        if (resetCode === '123456') {
            setTimeout(() => {
                alert('Password reset successful! Please login.');
                setShowForgotPwd(false);
                setResetStep('email');
                setLoading(false);
            }, 1000);
        } else {
            alert('Invalid code');
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
            {/* Rich Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.3),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.3),transparent_50%)]" />
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

            {/* Glassmorphism Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative z-10 my-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                {/* Header */}
                <div className="text-center mb-8 relative">
                    <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 rotate-3 transform hover:rotate-6 transition-all duration-500 group">
                        <Lock className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {showForgotPwd ? 'Reset Password' : step === 'verify' ? 'Verify Code' : mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-slate-300 text-sm mt-3 font-light">
                        {showForgotPwd ? 'Recover access to your account' : step === 'verify' ? `Enter code sent to ${formData.phone}` :
                            mode === 'signin' ? 'Sign in to access your dashboard' : 'Join us to manage events efficiently'}
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl flex items-center gap-3 backdrop-blur-sm">
                        <span className="text-xl">⚠️</span> {error}
                    </div>
                )}

                {/* Demo OTP Banner */}
                {demoOtp && step === 'verify' && !showForgotPwd && (
                    <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-fade-in text-center">
                        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Verification Code</p>
                        <p className="text-3xl font-mono font-bold text-emerald-300 tracking-widest">{demoOtp}</p>
                    </div>
                )}

                {showForgotPwd ? (
                    // Forgot Password Flow
                    <div className="space-y-6 animate-fade-in">
                        {resetStep === 'email' ? (
                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 ml-1 mb-1 block uppercase tracking-wide">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl outline-none focus:bg-slate-900/80 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm text-white placeholder-slate-500 font-medium"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" isLoading={loading} className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold">
                                    Send Reset Code
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetConfirm} className="space-y-4">
                                <div className="text-center mb-4">
                                    <p className="text-slate-300 text-sm">Enter code sent to {resetEmail}</p>
                                    <p className="text-indigo-400 text-xs mt-1 font-mono">Mock Code: 123456</p>
                                </div>
                                <input
                                    type="text"
                                    placeholder="000000"
                                    className="w-full text-center text-3xl tracking-[1rem] py-4 bg-slate-900/50 border border-slate-700/50 rounded-xl outline-none focus:border-indigo-500/50 transition-all font-bold text-white placeholder-slate-600"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl outline-none focus:border-indigo-500/50 transition-all text-sm text-white placeholder-slate-500"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <Button type="submit" isLoading={loading} className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/30 font-semibold">
                                    Update Password
                                </Button>
                            </form>
                        )}
                        <button onClick={() => { setShowForgotPwd(false); setResetStep('email'); }} className="w-full text-sm text-slate-400 hover:text-white transition-colors">
                            Back to Login
                        </button>
                    </div>
                ) : step === 'verify' ? (
                    // OPT Verification Form
                    <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
                        <div className="text-center">
                            <input
                                type="text"
                                placeholder="000000"
                                className="w-full text-center text-3xl tracking-[1rem] py-4 bg-slate-900/50 border border-slate-700/50 rounded-xl outline-none focus:bg-slate-900/80 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-white placeholder-slate-600"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                required
                            />
                        </div>
                        <Button type="submit" isLoading={loading} className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 font-semibold">
                            Verify & Login
                        </Button>
                        <button type="button" onClick={() => setStep('form')} className="w-full text-sm text-slate-400 hover:text-white transition-colors">
                            Back to details
                        </button>
                    </form>
                ) : (
                    // Main Auth Form
                    <div className="animate-fade-in relative">
                        <div className="flex bg-slate-800/50 p-1.5 rounded-xl mb-8 border border-white/5">
                            <button
                                onClick={() => setMode('signin')}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${mode === 'signin' ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10 backdrop-blur-md' : 'text-slate-400 hover:text-white'}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setMode('signup')}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${mode === 'signup' ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10 backdrop-blur-md' : 'text-slate-400 hover:text-white'}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-5">

                            {/* Sign Up: Name Fields */}
                            {mode === 'signup' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 ml-1 mb-1 block uppercase tracking-wide">First Name</label>
                                        <input
                                            name="firstName"
                                            placeholder="John"
                                            className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl outline-none focus:bg-slate-900/80 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm text-white placeholder-slate-500 font-medium"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 ml-1 mb-1 block uppercase tracking-wide">Last Name</label>
                                        <input
                                            name="lastName"
                                            placeholder="Doe"
                                            className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl outline-none focus:bg-slate-900/80 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm text-white placeholder-slate-500 font-medium"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="text-xs font-semibold text-slate-300 ml-1 mb-1 block uppercase tracking-wide">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="john@example.com"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl outline-none focus:bg-slate-900/80 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm text-white placeholder-slate-500 font-medium"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Sign Up: Phone */}
                            {mode === 'signup' && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 ml-1 mb-1 block uppercase tracking-wide">Phone</label>
                                    <div className="relative group">
                                        <Smartphone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl outline-none focus:bg-slate-900/80 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm text-white placeholder-slate-500 font-medium"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Password */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs font-semibold text-slate-300 ml-1 block uppercase tracking-wide">Password</label>
                                    {mode === 'signin' && (
                                        <button type="button" onClick={() => setShowForgotPwd(true)} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                                            Forgot?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl outline-none focus:bg-slate-900/80 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm text-white placeholder-slate-500 font-medium"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5 text-slate-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Sign Up: Profile Image */}
                            {mode === 'signup' && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 ml-1 mb-1 block uppercase tracking-wide">Profile Picture</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-6 h-6 text-slate-500" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium text-slate-200 transition-colors w-full justify-center">
                                                <Upload className="w-4 h-4" />
                                                Choose Image
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                            </label>
                                            <p className="text-[10px] text-slate-400 mt-2 ml-1 text-center">JPG, PNG or GIF up to 2MB</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button type="submit" isLoading={loading} className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 font-semibold transform hover:scale-[1.02] active:scale-[0.98] transition-all">
                                {mode === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#1a202e] px-2 text-slate-400">Or continue with</span></div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:bg-slate-50 transform hover:scale-[1.01] active:scale-[0.99]"
                        >
                            <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google" className="w-5 h-5" />
                            {/* DYNAMIC TEXT BASED ON MODE */}
                            {mode === 'signin' ? 'Sign In with Google' : 'Sign Up with Google'}
                        </button>
                    </div>
                )}
            </div>

            {/* Simple Footer */}
            <div className="absolute bottom-6 text-slate-500 text-xs text-center w-full">
                &copy; 2025 EventFlow. Secure Authentication.
            </div>
        </div>
    );
};

export default Login;
