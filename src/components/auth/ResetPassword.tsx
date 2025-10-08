// src/components/auth/ResetPassword.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (password.length < 6) {
      setErr("Wachtwoord moet minimaal 6 tekens zijn.");
      return;
    }
    if (password !== confirm) {
      setErr("Wachtwoorden komen niet overeen.");
      return;
    }

    setSubmitting(true);
    // Belangrijk: bij een reset-link stuurt Supabase een access_token mee.
    // supabase.auth.updateUser gebruikt die automatisch (geen user-id nodig).
    const { error } = await supabase.auth.updateUser({ password });

    setSubmitting(false);
    if (error) {
      setErr(error.message);
      return;
    }

    setMsg("Wachtwoord is bijgewerkt. Je kunt nu inloggen.");
    // even een korte pauze zodat de gebruiker de melding ziet
    setTimeout(() => navigate("/login", { replace: true }), 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-1">Nieuw wachtwoord instellen</h1>
        <p className="text-sm text-gray-600 mb-4">
          Voer hieronder je nieuwe wachtwoord in.
        </p>

        {err && (
          <div className="mb-3 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">
            {err}
          </div>
        )}
        {msg && (
          <div className="mb-3 rounded bg-green-50 text-green-700 px-3 py-2 text-sm">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Nieuw wachtwoord</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimaal 6 tekens"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Bevestig wachtwoord</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-60"
          >
            {submitting ? "Bijwerken…" : "Wachtwoord bijwerken"}
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="mt-3 w-full text-sm text-gray-600 underline"
        >
          Terug naar login
        </button>
      </div>
    </div>
  );
}