import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isPending: boolean;
  error: any | null;
  setSession: (user: AuthUser | null, accessToken: string | null) => void;
  setError: (error: any) => void;
  setPending: (pending: boolean) => void;
}

// Global store to manage user session and active access token in-memory
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isPending: true,
  error: null,
  setSession: (user, accessToken) => set({ user, accessToken, isPending: false, error: null }),
  setError: (error) => set({ error, isPending: false }),
  setPending: (pending) => set({ isPending: pending }),
}));

// Getter helper for the API fetcher to access the current JWT access token
export const getAccessToken = () => useAuthStore.getState().accessToken;

let refreshTimer: any = null;

const startRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  // Refresh access token after 14 minutes (short-lived access tokens expire in 15m)
  refreshTimer = setTimeout(async () => {
    console.log("[Auth] Background silent refresh running...");
    await authClient.silentRefresh();
  }, 14 * 60 * 1000);
};

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const authClient = {
  useSession: () => {
    const user = useAuthStore((s) => s.user);
    const isPending = useAuthStore((s) => s.isPending);
    const error = useAuthStore((s) => s.error);

    return {
      data: user ? { user } : null,
      isPending,
      error,
    };
  },

  signIn: {
    email: async ({ email, password }: any) => {
      useAuthStore.getState().setPending(true);
      try {
        // 1. Authenticate with Firebase client
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        // 2. Exchange Firebase ID Token for backend session cookies + Access Token
        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to log in on server");
        }

        const data = await res.json();
        useAuthStore.getState().setSession(data.user, data.accessToken);
        startRefreshTimer();

        return { data: { user: data.user }, error: null };
      } catch (error: any) {
        console.error("[Auth] Login error:", error);
        useAuthStore.getState().setError(error);
        return { data: null, error };
      }
    },

    google: async (role: "guest" | "host" = "guest") => {
      useAuthStore.getState().setPending(true);
      try {
        // 1. Trigger Google popup via Firebase client
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();

        // 2. Exchange Google token for backend session
        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken, role, name: result.user.displayName }),
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to register social login");
        }

        const data = await res.json();
        useAuthStore.getState().setSession(data.user, data.accessToken);
        startRefreshTimer();

        return { data: { user: data.user }, error: null };
      } catch (error: any) {
        console.error("[Auth] Google login error:", error);
        useAuthStore.getState().setError(error);
        return { data: null, error };
      }
    },
  },

  signUp: {
    email: async ({ name, email, password, role = "guest" }: any) => {
      useAuthStore.getState().setPending(true);
      try {
        // 1. Email Pre-Registration check (ZeroBounce verification + DB uniqueness check)
        const preCheck = await fetch(`${BACKEND_URL}/api/auth/pre-register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          credentials: "include",
        });

        if (!preCheck.ok) {
          const err = await preCheck.json().catch(() => ({}));
          throw new Error(err.message || "Email validation failed");
        }

        // 2. Register user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // 3. Update name profile in Firebase
        await updateProfile(firebaseUser, { displayName: name });

        // 4. Retrieve client ID token
        const idToken = await firebaseUser.getIdToken();

        // 5. Complete registration on Mongoose database
        const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken, name, role }),
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Server registration failed");
        }

        const data = await res.json();
        useAuthStore.getState().setSession(data.user, data.accessToken);
        startRefreshTimer();

        return { data: { user: data.user }, error: null };
      } catch (error: any) {
        console.error("[Auth] Registration error:", error);
        useAuthStore.getState().setError(error);
        return { data: null, error };
      }
    },
  },

  signOut: async () => {
    useAuthStore.getState().setPending(true);
    try {
      // 1. Call backend logout to clear cookie and revoke session
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch((err) => console.warn("Logout backend sync warning:", err));

      // 2. Logout from Firebase client
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("[Auth] Firebase logout error:", error);
    } finally {
      // 3. Clear local states
      useAuthStore.getState().setSession(null, null);
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
      }
    }
  },

  sendVerificationEmail: async ({ email, callbackURL }: any) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user, { url: callbackURL });
        return { error: null };
      } else {
        throw new Error("No active Firebase user found to verify email");
      }
    } catch (error: any) {
      console.error("[Auth] Email verification link error:", error);
      return { error };
    }
  },

  resetPassword: async (options: any) => {
    try {
      if (options.newPassword) {
        // Complete the password reset with oobCode (token) and new password
        await confirmPasswordReset(auth, options.token, options.newPassword);
        return { error: null };
      } else {
        // Send a reset password email link
        await sendPasswordResetEmail(auth, options.email, { url: options.redirectTo });
        return { error: null };
      }
    } catch (error: any) {
      console.error("[Auth] Password reset action error:", error);
      return { error };
    }
  },

  // Silent session refresh using HttpOnly cookie (auto-run on page refresh/initial load)
  silentRefresh: async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        useAuthStore.getState().setSession(null, null);
        return false;
      }

      const data = await res.json();
      useAuthStore.getState().setSession(data.user, data.accessToken);
      startRefreshTimer();
      return true;
    } catch (error) {
      console.error("[Auth] Silent refresh network failure:", error);
      useAuthStore.getState().setSession(null, null);
      return false;
    }
  },
};

// Immediately check server session cookies to authenticate returning users silently on load
const initializeSession = async () => {
  try {
    await authClient.silentRefresh();
  } catch (error) {
    console.error("[Auth] Session initialization error:", error);
    useAuthStore.getState().setSession(null, null);
  }
};

initializeSession();
