import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

type Props = {
  onSelectClient: (id: string) => void;
};

export default function ClientsList({ onSelectClient }: Props) {
  const { profile } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, [profile?.id]);

  async function loadClients() {
    if (!profile?.id) return;

    // 1️⃣ haal alle gekoppelde client_ids op
    const { data: relations } = await supabase
      .from('coach_client_relations') // juiste tabelnaam
      .select('client_id')
      .eq('coach_id', profile.id);

    if (!relations || relations.length === 0) {
      setClients([]);
      setLoading(false);
      return;
    }

    // 2️⃣ haal de clientprofielen op
    const ids = relations.map(r => r.client_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', ids);

    setClients(profiles || []);
    setLoading(false);
  }

  if (loading) return <p>Bezig met laden...</p>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Mijn cliënten</h2>
      {clients.length === 0 ? (
        <p className="text-gray-500">Nog geen gekoppelde cliënten.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {clients.map(client => (
            <li
              key={client.id}
              onClick={() => onSelectClient(client.id)}
              className="py-2 cursor-pointer hover:bg-gray-50"
            >
              <p className="font-medium text-gray-800">{client.full_name}</p>
              <p className="text-sm text-gray-500">{client.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}