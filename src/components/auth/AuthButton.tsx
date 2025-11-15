// src/components/auth/AuthButton.tsx
"use client";

import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthButton() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();

  const userInitial =
    user?.displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-xs font-semibold text-stone-50 shadow-sm">
          {userInitial}
        </span>

        <button
          type="button"
          onClick={signOutUser}
          disabled={loading}
          className="
            inline-flex items-center gap-1
            rounded-full border border-stone-300
            bg-white/80 px-3 py-1.5
            text-[11px] sm:text-sm font-serif
            hover:bg-white transition
            disabled:opacity-60
          "
        >
          <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Sign out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={signInWithGoogle}
      disabled={loading}
      className="
        inline-flex items-center gap-1
        rounded-full border border-stone-300
        bg-stone-900 text-stone-50
        px-3 py-1.5
        text-[11px] sm:text-sm font-serif
        shadow-sm hover:bg-stone-800
        transition disabled:opacity-60
      "
    >
      <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
      <span>{loading ? "Connecting…" : "Sign in"}</span>
    </button>
  );
}
