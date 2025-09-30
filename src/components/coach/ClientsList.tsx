import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface Client {
  id: string;
  full_name: string;
  email: string;
  last_check_in?: string;
  check_in_count?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export function ClientsList({ onSelectClient }: { onSelectClient: (id: string) => void }) {
  const { profile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, [profile]);

  async function loadClients() {
    if (!profile) return;

    const { data: relationships } = await supabase
      .from('coach_client_relationships')
      .select('client_id, profiles!coach_client_relationships_client_id_fkey(id, full_name, email)')
      .eq('coach_id', profile.id);

    if (!relationships) {
      setLoading(false);
      return;
    }

    const clientsData = await Promise.all(
      relationships.map(async (rel: any) => {
        const client = rel.profiles;

        const { data: checkIns, count } = await supabase
          .from('check_ins')
          .select('created_at', { count: 'exact' })
          .eq('user_id', client.id)
          .order('created_at', { ascending: false })
          .limit(1);

        return {
          id: client.id,
          full_name: client.full_name,
          email: client.email,
          last_check_in: checkIns?.[0]?.created_at,
          check_in_count: count || 0,
          trend: 'neutral' as const,
        };
      })
    );

    setClients(clientsData);
    setLoading(false);
  }

  function formatLastCheckIn(date?: string) {
    if (!date) return 'Never';
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">All Clients</h2>
        <p className="text-gray-500">Loading clients...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">All Clients</h2>

      {clients.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No clients yet</p>
          <p className="text-sm text-gray-400 mt-2">Clients will appear here when they join</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((client) => (
            <div
              key={client.id}
              onClick={() => onSelectClient(client.id)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.full_name}</h3>
                    <p className="text-sm text-gray-500">{client.email}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatLastCheckIn(client.last_check_in)}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {client.check_in_count} check-ins
                      </span>
                    </div>
                  </div>
                </div>
                {client.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                {client.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-500" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}