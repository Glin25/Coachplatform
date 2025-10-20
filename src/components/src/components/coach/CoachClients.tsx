import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Row = {
  client_id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  linked_at: string; // ISO-datetime
};

export default function CoachClients() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);
      setLoading(true);
      const { data, error } = await supabase.rpc("my_clients");
      if (cancelled) return;
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setRows((data || []) as Row[]);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse h-4 w-40 bg-gray-200 rounded mb-3" />
        <div className="space-y-2">
          <div className="h-16 bg-gray-100 rounded" />
          <div className="h-16 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600">Fout bij laden: {error}</div>;
  }

  if (!rows.length) {
    return <div className="p-4 text-gray-600">Nog geen cliënten gekoppeld.</div>;
  }

  return (
    <div className="p-4 grid gap-3">
      {rows.map((r) => (
        <div key={r.client_id} className="border rounded-lg p-3">
          <div className="font-medium">
            {r.full_name || "Naam onbekend"}
          </div>
          <div className="text-sm text-gray-600">{r.email}</div>
          <div className="text-xs text-gray-500 uppercase">{r.role || "client"}</div>
          <div className="text-xs text-gray-400">
            Gekoppeld: {new Date(r.linked_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}