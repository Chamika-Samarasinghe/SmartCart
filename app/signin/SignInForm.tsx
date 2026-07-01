"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { signIn as webAuthnSignIn } from "next-auth/webauthn";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    if (emailError) setEmailError(null);
  }

  async function handlePasskey() {
    const trimmed = email.trim();
    if (trimmed && !EMAIL_RE.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError(null);
    setPasskeyError(null);
    setPasskeyLoading(true);
    try {
      await webAuthnSignIn("webauthn", {
        email: trimmed || undefined,
        callbackUrl,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.toLowerCase().includes("cancel")) {
        setPasskeyError("Passkey sign-in failed. Try again.");
      }
    } finally {
      setPasskeyLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium shadow-sm transition-colors"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <button
        onClick={() => signIn("facebook", { callbackUrl })}
        className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white font-medium shadow-sm transition-colors"
      >
        <FacebookIcon />
        Continue with Facebook
      </button>

      <div className="flex items-center gap-2 my-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="space-y-1">
          <input
            type="email"
            placeholder="Email — leave blank to use saved passkey"
            value={email}
            onChange={handleEmailChange}
            autoComplete="username webauthn"
            aria-label="Email address"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
            className={`w-full py-2.5 px-3 rounded-lg border text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
              emailError
                ? "border-red-400 focus:ring-red-400 bg-red-50"
                : "border-gray-200 focus:ring-indigo-400"
            }`}
          />
          {emailError && (
            <p id="email-error" className="text-xs text-red-600">{emailError}</p>
          )}
        </div>
        <button
          onClick={handlePasskey}
          disabled={passkeyLoading}
          className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium shadow-sm transition-colors disabled:opacity-60"
        >
          <PasskeyIcon />
          {passkeyLoading ? "Waiting for passkey…" : "Continue with Passkey"}
        </button>
        <p className="text-xs text-gray-400 text-center">
          New here? Enter your email and a passkey account will be created.
        </p>
        {passkeyError && (
          <p className="text-xs text-red-600 text-center">{passkeyError}</p>
        )}
      </div>
    </div>
  );
}

function PasskeyIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="7" r="4" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h1" />
      <path d="m19 11-5 5" />
      <path d="M17 17h.01" />
      <rect x="14" y="11" width="8" height="5" rx="1" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
