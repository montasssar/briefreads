// src/lib/firebaseClient.ts
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Typed global cache for Firebase (browser + SSR safe)
declare global {
  var BRIEFREADS_FIREBASE_APP: FirebaseApp | undefined;
}

function createFirebaseApp(): FirebaseApp {
  if (!firebaseConfig.apiKey) {
    throw new Error(
      "Firebase config missing. Add NEXT_PUBLIC_FIREBASE_* env vars."
    );
  }

  // SSR (Node)
  if (typeof window === "undefined") {
    return getApps()[0] ?? initializeApp(firebaseConfig);
  }

  // Client (Browser)
  if (!globalThis.BRIEFREADS_FIREBASE_APP) {
    globalThis.BRIEFREADS_FIREBASE_APP =
      getApps()[0] ?? initializeApp(firebaseConfig);
  }

  return globalThis.BRIEFREADS_FIREBASE_APP;
}

const app = createFirebaseApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
