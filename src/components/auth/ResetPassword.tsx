// src/components/auth/ResetPassword.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // LET OP: precies dit pad

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // 1) Haal sessie op uit de e-mail link (hash bevat access_token)
  useEffect(() => {
    const ensureSession = async () => {
      try {
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.hash);
          if (error) setErr(error.message);
        }
      } catch {}
    };
    ensureSession();
  }, []);

  // 2) Verstuur nieuw wachtwoord
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (password.length < 6) return setErr('Wachtwoord moet minimaal 6 tekens zijn.');
    if (password !== confirm)  return setErr('Wachtwoorden komen niet overeen.');

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) return setErr(error.message);

    setMsg('Wachtwoord is bijgewerkt. Je kunt nu inloggen.');
    setTimeout(() => navigate('/login', { replace: true }), 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-2">Nieuw wachtwoord instellen</h1>
        <p className="text-sm text-gray-600 mb-4">Voer hieronder je nieuwe wachtwoord in.</p>

        {err && <div className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
        {msg && <div className="mb-3 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nieuw wachtwoord</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bevestig wachtwoord</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <button type="submit" disabled={submitting} className="w-full rounded bg-blue-600 text-white py-2 font-medium disabled:opacity-50">
            {submitting ? 'Bezig…' : 'Wachtwoord bijwerken'}
          </button>
        </form>

        <button type="button" onClick={() => navigate('/login')} className="mt-4 w-full text-center text-blue-600 hover:underline">
          Terug naar login
        </button>
      </div>
    </div>
  );
}