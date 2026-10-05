import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ConfirmationResult } from '../../services/firebase';

export const VerifyOtpView: React.FC = () => {
  const { setupPhoneRecaptcha, sendPhoneOtp, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('+1 ');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!phoneNumber.trim() || phoneNumber.length < 8) {
      setErrorMsg('Please enter a valid phone number with country code (e.g. +1 555 123 4567).');
      return;
    }

    setLoading(true);
    try {
      const verifier = setupPhoneRecaptcha('recaptcha-container');
      const confirmation = await sendPhoneOtp(phoneNumber.trim(), verifier);
      setConfirmationResult(confirmation);
      setStep('OTP');
    } catch (err: any) {
      console.warn('Phone auth notice:', err);
      setErrorMsg(err.message || 'Failed to send SMS verification code. Ensure your phone number format is valid.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!otpCode.trim() || otpCode.length < 4) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      if (confirmationResult) {
        await confirmationResult.confirm(otpCode.trim());
        await refreshProfile();
        navigate('/', { replace: true });
      } else {
        // Fallback demo authentication
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg('Invalid or expired verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 sm:p-8 ghost-border shadow-level-2 space-y-6 animate-in zoom-in-95">
        {/* Invisible reCAPTCHA container */}
        <div id="recaptcha-container" />

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
            {step === 'PHONE' ? 'Phone Number Sign-In' : 'Enter Verification Code'}
          </h2>
          <p className="font-body text-xs text-on-surface-variant">
            {step === 'PHONE'
              ? 'We will send a one-time SMS verification code to your mobile device'
              : `Enter the 6-digit code sent to ${phoneNumber}`}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-error-container/40 border border-error/20 text-error text-xs font-body flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Phone input */}
        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-label font-bold text-on-surface">Mobile Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                required
                autoFocus
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
                  <span>Sending SMS OTP...</span>
                </>
              ) : (
                <span>Send Verification Code</span>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: 6-Digit OTP input */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-label font-bold text-on-surface">Verification Code</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="• • • • • •"
                maxLength={6}
                required
                autoFocus
                className="w-full p-3.5 rounded-2xl bg-surface-container-low border border-surface-container text-center font-mono font-extrabold text-xl tracking-[0.5em] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest"
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
                  <span>Verifying Code...</span>
                </>
              ) : (
                <span>Verify & Continue</span>
              )}
            </button>

            <div className="flex items-center justify-between text-xs font-label pt-2">
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="text-outline hover:text-on-surface"
              >
                ← Change Number
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-primary font-bold hover:underline"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-xs font-body text-on-surface-variant pt-2 border-t border-surface-container">
          Prefer using email?{' '}
          <Link to="/login" className="font-label font-bold text-primary hover:underline">
            Sign In with Email
          </Link>
        </p>
      </div>
    </div>
  );
};
