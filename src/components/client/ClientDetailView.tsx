import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ClientCheckInsTab from '../coach/ClientCheckInsTab';
import ClientGoalsTab from '../coach/ClientGoalsTab';
import ClientNotesTab from '../coach/ClientNotesTab';
import ClientReflectionsTab from '../coach/ClientReflectionsTab';
import { ArrowLeft, User } from 'lucide-react';

interface Client {
  id: string;
  full_name: string;
  email: string;
}

export function ClientDetailView({ clientId, onBack }: { clientId: string; onBack: () => void }) {
  const [client, setClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<'checkins' | 'goals' | 'notes' | 'reflections'>('checkins');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClient();
  }, [clientId]);

  async function loadClient() {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('id', clientId)
      .maybeSingle();

    if (data) setClient(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p>Loading client...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <button onClick={onBack} className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <p>Client not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.full_name}</h1>
              <p className="text-sm text-gray-600">{client.email}</p>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab('checkins')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'checkins'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Check-ins
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'goals'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Goals
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'notes'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab('reflections')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'reflections'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Reflections
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'checkins' && <ClientCheckInsTab clientId={clientId} />}
        {activeTab === 'goals' && <ClientGoalsTab clientId={clientId} />}
        {activeTab === 'notes' && <ClientNotesTab clientId={clientId} />}
        {activeTab === 'reflections' && <ClientReflectionsTab clientId={clientId} />}
      </div>
    </div>
  );
}