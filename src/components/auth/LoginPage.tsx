import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../lib/auth';
import { Login } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  // formulier-state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // wachtwoord-reset state
  const [sendingReset, setSendingReset] = useState(false);
  const [resetErr, setResetErr] = useState<string | null>(null);
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  }

  // Verstuur reset-link (verwijst naar /reset op jouw domein)
  async function sendReset() {
    setResetErr(null);
    setResetMsg(null);

    if (!email) {
      setResetErr('Vul eerst je e-mailadres in.');
      return;
    }

    setSendingReset(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset`,
    });
    setSendingReset(false);

    if (error) {
      setResetErr(error.message);
    } else {
      setResetMsg('We hebben een reset-link naar je e-mail gestuurd.');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-full">
            <Login className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-8">Sign in to your coaching account</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        {resetErr && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
            {resetErr}
          </div>
        )}
        {resetMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-4">
            {resetMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
            className="w-full bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-600">Wachtwoord vergeten?</span>
          <button
            type="button"
            onClick={sendReset}
            disabled={sendingReset}
            className="text-blue-600 hover:underline disabled:opacity-50"
          >
            {sendingReset ? 'Versturen…' : 'Stuur reset-link'}
          </button>
        </div>
      </div>
    </div>
  );
}