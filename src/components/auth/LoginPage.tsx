import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../lib/auth';
import { LogIn } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  // ====== STATE ======
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ====== RESET PASSWORD STATE ======
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [resetErr, setResetErr] = useState<string | null>(null);
  const [sendingReset, setSendingReset] = useState(false);

  const navigate = useNavigate();

  // ====== INLOGGEN ======
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

  // ====== RESET LINK VERSTUREN ======
  async function handleSendReset(e: React.MouseEvent) {
    e.preventDefault();
    setResetErr(null);
    setResetMsg(null);

    if (!email) {
      setResetErr('Vul eerst je e-mailadres in.');
      return;
    }

    try {
      setSendingReset(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset`,
      });
      if (error) throw error;
      setResetMsg('We hebben je een reset-mail gestuurd.');
    } catch (err: any) {
      setResetErr(err?.message ?? 'Versturen mislukt.');
    } finally {
      setSendingReset(false);
    }
  }

  // ====== UI ======
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-full">
            <LogIn className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-6">Sign in to your coaching account</p>

        {/* Foutmeldingen */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}
        {resetErr && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-3 text-sm">
            {resetErr}
          </div>
        )}
        {resetMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-3 text-sm">
            {resetMsg}
          </div>
        )}

        {/* Inlogformulier */}
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

        {/* Reset-link sectie */}
        <p className="text-sm text-gray-600 mt-6 text-center">
          Wachtwoord vergeten?{' '}
          <button
            type="button"
            onClick={handleSendReset}
            disabled={sendingReset}
            className="text-blue-600 hover:underline disabled:opacity-50"
          >
            {sendingReset ? 'Versturen…' : 'Stuur reset-link'}
          </button>
        </p>
      </div>
    </div>
  );
}