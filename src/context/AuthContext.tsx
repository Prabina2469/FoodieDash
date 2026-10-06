import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  FirebaseUser,
  ConfirmationResult
} from '../services/firebase';
import { setApiAuthToken } from '../services/apiClient';
import { userService } from '../services/userService';
import { Role, UserProfile } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  role: Role;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, pass: string) => Promise<UserProfile | null>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<UserProfile | null>;
  loginWithGoogle: () => Promise<UserProfile | null>;
  setupPhoneRecaptcha: (containerId: string) => RecaptchaVerifier;
  sendPhoneOtp: (phone: string, recaptchaVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  loginWithDemo: (demoRole?: Role) => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<Role>('CUSTOMER');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync profile from backend (authoritative role source)
  const syncProfile = async (
    uid: string,
    token: string,
    email?: string | null,
    displayName?: string | null
  ): Promise<UserProfile | null> => {
    try {
      setApiAuthToken(token);
      // Backend call to /users/me for authoritative role & profile
      const profile = await userService.getMyProfile();
      if (profile && profile.role) {
        setUserProfile(profile);
        setRole(profile.role);
        return profile;
      }
    } catch (err) {
      console.warn('Backend profile fetch failed, using safe fallback:', err);
    }

    // Safe fallback profile if backend is offline or during initial registration:
    // IMPORTANT: Least privileged role ('CUSTOMER') is ALWAYS the fallback default.
    // Frontend NEVER trusts an arbitrary or user-manipulated role from localStorage for authorization.
    const fallbackProfile: UserProfile = {
      firebaseUid: uid,
      name: displayName || (email ? email.split('@')[0] : 'Customer'),
      email: email || `${uid}@foodiedash.io`,
      role: 'CUSTOMER',
      emailVerified: true,
      status: 'ACTIVE'
    };
    setUserProfile(fallbackProfile);
    setRole('CUSTOMER');
    return fallbackProfile;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        try {
          const token = await user.getIdToken();
          await syncProfile(user.uid, token, user.email, user.displayName);
        } catch (err) {
          console.error('Failed to get user token:', err);
        }
      } else {
        // Check for persistent demo session
        const demoUid = localStorage.getItem('foodiedash_demo_uid');
        const demoToken = localStorage.getItem('foodiedash_auth_token');

        if (demoUid && demoToken) {
          try {
            setApiAuthToken(demoToken);
            await syncProfile(demoUid, demoToken, `${demoUid}@foodiedash.io`, demoUid);
          } catch (err) {
            console.warn('Demo session restoration error', err);
            setCurrentUser(null);
            setUserProfile(null);
            setRole('CUSTOMER');
            setApiAuthToken(null);
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
          setRole('CUSTOMER');
          setApiAuthToken(null);
          localStorage.removeItem('foodiedash_user_role');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<UserProfile | null> => {
    try {
      setError(null);
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const token = await cred.user.getIdToken();
      const profile = await syncProfile(cred.user.uid, token, cred.user.email, cred.user.displayName);
      return profile;
    } catch (err: any) {
      const msg = err?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string): Promise<UserProfile | null> => {
    try {
      setError(null);
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const token = await cred.user.getIdToken();
      const profile = await syncProfile(cred.user.uid, token, cred.user.email, name);
      if (profile && name) {
        try {
          await userService.updateMyProfile({ name });
        } catch (e) {
          console.warn('Profile name update note:', e);
        }
      }
      return profile;
    } catch (err: any) {
      const msg = err?.message || 'Signup failed. Please check your details.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<UserProfile | null> => {
    try {
      setError(null);
      setLoading(true);
      const cred = await signInWithPopup(auth, googleProvider);
      const token = await cred.user.getIdToken();
      const profile = await syncProfile(cred.user.uid, token, cred.user.email, cred.user.displayName);
      return profile;
    } catch (err: any) {
      const msg = err?.message || 'Google sign in failed.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const setupPhoneRecaptcha = (containerId: string): RecaptchaVerifier => {
    return new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      }
    });
  };

  const sendPhoneOtp = async (phone: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
    try {
      setError(null);
      const confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
      return confirmationResult;
    } catch (err: any) {
      const msg = err?.message || 'Failed to send verification SMS.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const loginWithDemo = async (demoRole: Role = 'CUSTOMER'): Promise<UserProfile | null> => {
    setLoading(true);
    setError(null);

    let demoUid = 'demo-customer-sarah';
    let demoEmail = 'sarah.jenkins@foodiedash.io';
    let demoName = 'Sarah Jenkins';
    let demoImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150';

    if (demoRole === 'ADMIN') {
      demoUid = 'dev-admin-alex';
      demoEmail = 'alex.carter@foodiedash.io';
      demoName = 'Alex Carter';
      demoImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
    } else if (demoRole === 'RESTAURANT_OWNER') {
      demoUid = 'dev-owner-1';
      demoEmail = 'mario.rossi@foodiedash.io';
      demoName = 'Mario Rossi';
      demoImage = 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150';
    } else if (demoRole === 'DELIVERY_PARTNER') {
      demoUid = 'dev-driver-1';
      demoEmail = 'david.chen@foodiedash.io';
      demoName = 'David Chen';
      demoImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';
    }

    const demoToken = demoUid;
    localStorage.setItem('foodiedash_demo_uid', demoUid);
    setApiAuthToken(demoToken);

    let profile: UserProfile | null = null;
    try {
      profile = await syncProfile(demoUid, demoToken, demoEmail, demoName);
    } catch (e) {
      console.warn('Demo profile sync:', e);
    }

    if (!profile) {
      profile = {
        firebaseUid: demoUid,
        name: demoName,
        email: demoEmail,
        role: demoRole,
        emailVerified: true,
        status: 'ACTIVE',
        profileImage: demoImage
      };
      setUserProfile(profile);
      setRole(demoRole);
    }

    setLoading(false);
    return profile;
  };

  const logout = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout note:', e);
    }
    localStorage.removeItem('foodiedash_demo_uid');
    localStorage.removeItem('foodiedash_user_role');
    localStorage.removeItem('foodiedash_auth_token');
    setApiAuthToken(null);
    setCurrentUser(null);
    setUserProfile(null);
    setRole('CUSTOMER');
  };

  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (userProfile?.firebaseUid) {
      const token = localStorage.getItem('foodiedash_auth_token') || userProfile.firebaseUid;
      return syncProfile(userProfile.firebaseUid, token, userProfile.email, userProfile.name);
    }
    return null;
  };

  const clearError = () => setError(null);

  const isAuthenticated = !!currentUser || !!userProfile;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        role,
        isAuthenticated,
        loading,
        error,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        setupPhoneRecaptcha,
        sendPhoneOtp,
        loginWithDemo,
        logout,
        refreshProfile,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
