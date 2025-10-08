// src/components/auth/ResetPassword.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// Kleine helper om de hash (#...) te parsen
function getHashParam(name: string) {
  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.substring(1)
    : window.location.hash;
  const params = new URLSearchParams(hash);
  return params.get(name);
}

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // ZET de Supabase sessie op basis van de tokens in de hash (#access_token & #refresh_token)
  useEffect(() => {
    async function ensureSession() {
      try {
        setErr(null);

        // 1) Probeer access/refresh tokens uit de hash te lezen
        const access_token = getHashParam('access_token');
        const refresh_token = getHashParam('refresh_token');

        if (access_token && refresh_token) {
          // Dit zet direct de sessie in Supabase
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (error) throw error;
          return; // sessie staat
        }

        // 2) Sommige flows leveren een `code` (PKCE). Dan wisselen we hem in:
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (error) throw error;
          return;
        }

        // 3) Als laatste: niets gevonden → waarschuwing tonen.
        // (Gebruiker moet écht via de reset-link uit de e-mail komen.)
        setErr('Geen geldige reset-sessie gevonden. Open deze pagina via de link in je e-mail.');
      } catch (e: any) {
        setErr(e?.message ?? 'Kon reset-sessie niet initialiseren.');
      }
    }

    ensureSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (password.length < 6) {
      setErr('Wachtwoord moet minimaal 6 tekens zijn.');
      return;
    }
    if (password !== confirm) {
      setErr('Wachtwoorden komen niet overeen.');
      return;
    }

    try {
      setSubmitting(true);
      // Dit werkt alléén als er nu een geldige sessie is (boven geregeld)
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMsg('Wachtwoord is bijgewerkt. Je kunt nu inloggen.');
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (e: any) {
      setErr(e?.message ?? 'Bijwerken van wachtwoord mislukt.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-1">Nieuw wachtwoord instellen</h1>
        <p className="text-sm text-gray-600 mb-4">Voer hieronder je nieuwe wachtwoord in.</p>

        {err && (
          <div className="mb-4 bg-red-50 text-red-700 text-sm px-3 py-2 rounded">
            {err}
          </div>
        )}
        {msg && (
          <div className="mb-4 bg-emerald-50 text-emerald-700 text-sm px-3 py-2 rounded">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nieuw wachtwoord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bevestig wachtwoord</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-blue-600 text-white py-2 font-medium disabled:opacity-50"
          >
            {submitting ? 'Bijwerken…' : 'Wachtwoord bijwerken'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-600 hover:underline text-sm">
            Terug naar login
          </a>
        </div>
      </div>
    </div>
  );
}