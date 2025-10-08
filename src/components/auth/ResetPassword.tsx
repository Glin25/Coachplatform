import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Als iemand via de mail komt, zit er een access_token in de URL (#… of ?…)
  // We hoeven ‘m niet zelf uit te lezen; supabase.updateUser() gebruikt de sessie.
  useEffect(() => {
    // niks nodig hier; formulier tonen is genoeg
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);

    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (error) {
      setMsg(error.message || "Kon wachtwoord niet wijzigen.");
      return;
    }

    setMsg("Wachtwoord gewijzigd! Je gaat terug naar de login…");
    setTimeout(() => navigate("/login", { replace: true }), 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded max-w-sm w-full space-y-4"
      >
        <h1 className="text-xl font-semibold">Nieuw wachtwoord</h1>

        {msg && <div className="text-sm text-blue-600">{msg}</div>}

        <input
          type="password"
          placeholder="Nieuw wachtwoord"
          className="border rounded px-3 py-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-blue-600 text-white rounded px-3 py-2"
        >
          {busy ? "Bezig…" : "Wachtwoord opslaan"}
        </button>
      </form>
    </div>
  );
}