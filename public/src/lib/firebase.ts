"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  type User
} from "firebase/auth";
// Firestore はこの段階では未使用だが初期化できるように置いておく
import { getFirestore } from "firebase/firestore";

// --- Firebase Web Config (NEXT_PUBLIC_*) ---
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
};

// SSR 側で読まれないよう "use client" を明示。複数初期化を防止。
const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * 匿名ログインを保証する（既ログインなら何もしない）
 */
export async function ensureAnonymousSignIn(): Promise<User> {
  const existing = auth.currentUser;
  if (existing) return existing;

  await signInAnonymously(auth);

  return await new Promise<User>((resolve, reject) => {
    const unsub = onAuthStateChanged(
      auth,
      (u) => {
        if (u) {
          resolve(u);
          unsub();
        }
      },
      (err) => {
        reject(err);
        unsub();
      }
    );
  });
}
