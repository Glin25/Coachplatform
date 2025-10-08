// src/components/auth/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../lib/auth';           // jouw bestaande login helper
import { supabase } from '../../lib/supabase';     // nodig voor reset e-mail

export default function LoginPage() {
  const navigate = useNavigate();

  // STATE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);         // voor Sign in
  const [sendingReset, setSendingReset] = useState(false); // voor Stuur reset-link

  const [error, setError] = useState<string | null>(null);
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  // INLOGGEN
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResetMsg(null);

    try {
      setLoading(true);
      await signIn(email, password);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.message ?? 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  }

  // RESET-LINK STUREN (ALLEEN E-MAIL NODIG)
  async function handleSendReset() {
    setError(null);
    setResetMsg(null);

    if (!email) {
      setError('Vul eerst je e-mailadres in.');
      return;
    }

    try {
      setSendingReset(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Zorg dat deze URL bestaat en routing /reset openbaar is
        redirectTo: 'https://coachplatform.vercel.app/reset',
      });
      if (error) throw error;
      setResetMsg('We hebben een reset-link naar je e-mail gestuurd.');
    } catch (err: any) {
      setError(err?.message ?? 'Kon geen reset-link sturen');
    } finally {
      setSendingReset(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold">Welcome Back</div>
          <p className="text-sm text-gray-600">Sign in to your coaching account</p>
        </div>

        {/* Meldingen */}
        {error && (
          <div className="mb-4 bg-red-50 text-red-700 text-sm px-3 py-2 rounded">
            {error}
          </div>
        )}
        {resetMsg && (
          <div className="mb-4 bg-emerald-50 text-emerald-700 text-sm px-3 py-2 rounded">
            {resetMsg}
          </div>
        )}

        {/* Inlogformulier */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 text-white py-2 font-medium disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Reset-link sectie */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Wachtwoord vergeten?</p>
          <button
            type="button"                 // BELANGRIJK: geen form submit!
            onClick={handleSendReset}
            disabled={sendingReset}
            className="text-blue-600 hover:underline disabled:opacity-50"
          >
            {sendingReset ? 'Versturen…' : 'Stuur reset-link'}
          </button>
        </div>

        {/* (optioneel) Registratie-link */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Nog geen account? <a className="text-blue-600 hover:underline" href="/register">Maak er een aan</a>
        </div>
      </div>
    </div>
  );
}