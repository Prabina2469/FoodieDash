import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const SignupView: React.FC = () => {
  const { signupWithEmail, loginWithGoogle, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localErr, setLocalErr] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErr(null);
    clearError();

    if (!name.trim() || !email.trim() || !password) {
      setLocalErr('Please complete all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalErr('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setLocalErr('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // Signup always registers as CUSTOMER role
      await signupWithEmail(email.trim(), password, name.trim());
      navigate('/', { replace: true });
    } catch (err: any) {
      setLocalErr(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLocalErr(null);
    clearError();
    try {
      await loginWithGoogle();
      navigate('/', { replace: true });
    } catch (err: any) {
      setLocalErr(err.message || 'Google sign-up failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 sm:p-8 ghost-border shadow-level-2 space-y-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-primary-bright flex items-center justify-center text-white shadow-glow-primary">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                restaurant
              </span>
            </div>
            <span className="text-2xl font-display font-extrabold text-primary tracking-tight">
              FoodieDash
            </span>
          </Link>
          <h2 className="font-headline font-bold text-xl text-on-surface">
            Create Your Account
          </h2>
          <p className="font-body text-xs text-on-surface-variant">
            Join FoodieDash to enjoy welcome discounts, express delivery & order tracking
          </p>
        </div>

        {/* Error Alert */}
        {(localErr || error) && (
          <div className="p-3.5 rounded-2xl bg-error-container/40 border border-error/20 text-error text-xs font-body flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{localErr || error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-label font-bold text-on-surface">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              required
              className="w-full p-3.5 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-label font-bold text-on-surface">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sarah@example.com"
              required
              className="w-full p-3.5 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-label font-bold text-on-surface">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="w-full p-3.5 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-label font-bold text-on-surface">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
              className="w-full p-3.5 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-primary text-white font-label text-sm font-bold hover:bg-primary-container shadow-glow-primary active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Customer Account</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-surface-container" />
          <span className="flex-shrink mx-4 text-[11px] font-label text-outline uppercase tracking-wider">
            Or sign up with
          </span>
          <div className="flex-grow border-t border-surface-container" />
        </div>

        {/* Google Auth Button */}
        <button
          onClick={handleGoogleSignup}
          type="button"
          className="w-full py-3 px-4 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label text-xs font-bold transition-all border border-surface-container flex items-center justify-center gap-2.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign up with Google</span>
        </button>

        {/* Footer: Login Link */}
        <p className="text-center text-xs font-body text-on-surface-variant">
          Already have a FoodieDash account?{' '}
          <Link to="/login" className="font-label font-bold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
