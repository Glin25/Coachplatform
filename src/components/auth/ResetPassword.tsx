import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // NIEUW: zet de token uit de e-mail-URL om naar een geldige sessie
  useEffect(() => {
    async function ensureSession() {
      try {
        // Supabase plakt de tokens in de URL-hash (#access_token=...)
        if (window.location.hash.includes("access_token")) {
          await supabase.auth.exchangeCodeForSession(window.location.hash);
        }
      } catch {
        // negeren; als het al goed is of niet nodig, gaan we door
      }
    }
    ensureSession();
  }, []);

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
    // Werkt nu omdat er (door useEffect) een sessie is
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setErr(error.message);
      return;
    }

    setMsg("Wachtwoord is bijgewerkt. Je kunt nu inloggen.");
    setTimeout(() => navigate("/login", { replace: true }), 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-1">Nieuw wachtwoord instellen</h1>
        <p className="text-sm text-gray-600 mb-4">Vul hieronder je nieuwe wachtwoord in.</p>

        {err && (
          <div className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        )}
        {msg && (
          <div className="mb-3 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {msg}
          </div>
        )}

        <label className="block text-sm font-medium mb-1">Nieuw wachtwoord</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
          required
        />

        <label className="block text-sm font-medium mb-1">Bevestig wachtwoord</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />

        <button
          disabled={submitting}
          className="w-full rounded bg-blue-600 text-white py-2"
        >
          {submitting ? "Bezig…" : "Wachtwoord bijwerken"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-2 text-sm underline"
        >
          Terug naar login
        </button>
      </form>
    </div>
  );
}