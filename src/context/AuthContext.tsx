import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { firebaseAuth, googleAuthProvider } from '../firebase/config';
import { getHinglishAuthErrorMessage } from '../firebase/errors';
import { localDb } from '../db/orbitDexie';
import type { UserProfile } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  cadetProfile: UserProfile | null;
  loading: boolean;
  isFirebaseReady: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  enterDemoCadetMode: (name?: string, email?: string) => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cadetProfile, setCadetProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check if real Firebase API key is configured
  const isFirebaseReady = Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    !import.meta.env.VITE_FIREBASE_API_KEY.includes('DummyKey')
  );

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Sync or retrieve cadet profile from local Dexie
        let localProf = await localDb.profile.get('default_cadet');
        if (!localProf) {
          localProf = {
            uid: user.uid,
            name: user.displayName || 'Cadet',
            email: user.email || '',
            avatarUrl: user.photoURL || undefined,
            examName: 'Orbit Exam Target',
            examDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
            dailyAvailableHours: 4.0,
            offDays: [0],
            timeSplit: { syllabus: 60, hardSkills: 25, softSkills: 15 },
            examModeEnabled: false,
            onboardingCompleted: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          await localDb.profile.put(localProf);
        } else {
          // Update profile with Firebase details
          await localDb.profile.update('default_cadet', {
            uid: user.uid,
            email: user.email || localProf.email,
            name: user.displayName || localProf.name,
            avatarUrl: user.photoURL || localProf.avatarUrl,
            updatedAt: Date.now(),
          });
        }
        setCadetProfile(localProf);
      } else {
        const localProf = await localDb.profile.get('default_cadet');
        setCadetProfile(localProf || null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const cred = await signInWithPopup(firebaseAuth, googleAuthProvider);
      if (cred.user) {
        await localDb.profile.update('default_cadet', {
          uid: cred.user.uid,
          name: cred.user.displayName || 'Cadet',
          email: cred.user.email || '',
          avatarUrl: cred.user.photoURL || undefined,
          updatedAt: Date.now(),
        });
      }
    } catch (err: unknown) {
      const errorCode = err && typeof err === 'object' && 'code' in err ? String(err.code) : String(err);
      const friendlyMsg = getHinglishAuthErrorMessage(errorCode);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, pass);
    } catch (err: unknown) {
      const errorCode = err && typeof err === 'object' && 'code' in err ? String(err.code) : String(err);
      const friendlyMsg = getHinglishAuthErrorMessage(errorCode);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
        await localDb.profile.update('default_cadet', {
          uid: cred.user.uid,
          name,
          email,
          updatedAt: Date.now(),
        });
      }
    } catch (err: unknown) {
      const errorCode = err && typeof err === 'object' && 'code' in err ? String(err.code) : String(err);
      const friendlyMsg = getHinglishAuthErrorMessage(errorCode);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
    } catch (err: unknown) {
      const errorCode = err && typeof err === 'object' && 'code' in err ? String(err.code) : String(err);
      const friendlyMsg = getHinglishAuthErrorMessage(errorCode);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(firebaseAuth);
      setCurrentUser(null);
    } catch (err: unknown) {
      const errorCode = err && typeof err === 'object' && 'code' in err ? String(err.code) : String(err);
      setAuthError(getHinglishAuthErrorMessage(errorCode));
    }
  };

  const enterDemoCadetMode = async (name = 'Cadet Aryan', email = 'cadet@orbit.app') => {
    setAuthError(null);
    await localDb.profile.update('default_cadet', {
      name,
      email,
      avatarUrl: undefined,
      updatedAt: Date.now(),
    });
    const updated = await localDb.profile.get('default_cadet');
    setCadetProfile(updated || null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        cadetProfile,
        loading,
        isFirebaseReady,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        resetPassword,
        logout,
        enterDemoCadetMode,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
