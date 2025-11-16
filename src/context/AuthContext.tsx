"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseApp,
} from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {
    console.warn("Auth not ready: signInWithGoogle called too early.");
  },
  signOutUser: async () => {
    console.warn("Auth not ready: signOutUser called too early.");
  },
});

function createFirebaseAppSafely(): FirebaseApp | null {
  // Never run Firebase init on the server
  if (typeof window === "undefined") {
    return null;
  }

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const missing = Object.entries(firebaseConfig).filter(
    ([, value]) => !value
  );

  if (missing.length > 0) {
    console.error(
      "Firebase config missing in environment. Auth will be disabled. Missing keys:",
      missing.map(([key]) => key)
    );
    // Important: do NOT throw here – just disable auth
    return null;
  }

  try {
    if (getApps().length > 0) {
      return getApp();
    }
    return initializeApp(firebaseConfig);
  } catch (err: unknown) {
    console.error("Failed to initialize Firebase app", err);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState<FirebaseApp | null>(null);

  // Initialize Firebase on the client only
  useEffect(() => {
    const firebaseApp = createFirebaseAppSafely();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApp(firebaseApp);
  }, []);

  // Attach auth listener once Firebase app is ready
  useEffect(() => {
    if (!app) {
      // No app → no auth, stop loading but keep user null
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    const auth = getAuth(app);

    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser ?? null);
      setLoading(false);
    });

    return () => unsub();
  }, [app]);

  const signInWithGoogle = async () => {
    if (!app) {
      console.warn("Auth disabled: Firebase app is not initialized.");
      return;
    }
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOutUser = async () => {
    if (!app) {
      console.warn("Auth disabled: Firebase app is not initialized.");
      return;
    }
    const auth = getAuth(app);
    await signOut(auth);
  };

  const value: AuthContextValue = {
    user,
    loading,
    signInWithGoogle,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
