import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  // ---- state voor inloggen ----
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- state voor reset-link ----
  const [sendingReset, setSendingReset] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [resetErr, setResetErr] = useState<string | null>(null);

  const navigate = useNavigate();

  // Inloggen met e-mail + wachtwoord
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  }

  // Alleen e-mail nodig -> reset-link sturen
  async function handleSendReset() {
    setResetMsg(null);
    setResetErr(null);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setResetErr('Vul eerst je e-mailadres in.');
      return;
    }

    try {
      setSendingReset(true);

      // LET OP: productie-URL + /reset moet in Supabase → Auth → URL Configuration → Redirect URLs staan
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://coachplatform.vercel.app/reset',
        // lokaal testen? gebruik tijdelijk: redirectTo: 'http://localhost:3000/reset',
      });

      if (error) throw error;
      setResetMsg('Reset-link is verstuurd. Check je e-mail.');
    } catch (e: any) {
      setResetErr(e?.message || 'Versturen mislukt.');
    } finally {
      setSendingReset(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-6">Sign in to your coaching account</p>

        {/* foutmelding login */}
        {error && (
          <div className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        {/* inlogformulier */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-md py-2 font-medium disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* reset-link sectie (buiten het form, vraagt geen wachtwoord) */}
        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Wachtwoord vergeten?</p>

          {resetErr && (
            <div className="mb-2 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
              {resetErr}
            </div>
          )}
          {resetMsg && (
            <div className="mb-2 rounded bg-green-100 text-green-700 px-3 py-2 text-sm">
              {resetMsg}
            </div>
          )}

          <button
            type="button"
            onClick={handleSendReset}
            disabled={sendingReset}
            className="text-blue-600 hover:underline disabled:opacity-50"
          >
            {sendingReset ? 'Versturen…' : 'Stuur reset-link'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link to="/register" className="text-sm text-gray-600 hover:underline">
            Nog geen account? Maak er een aan
          </Link>
        </div>
      </div>
    </div>
  );
}