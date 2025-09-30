import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, TrendingUp } from 'lucide-react';

interface CheckIn {
  id: string;
  mood_score: number;
  energy_level: number;
  sleep_quality: number;
  notes?: string;
  created_at: string;
}

export function ClientCheckInsTab({ clientId }: { clientId: string }) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCheckIns();
  }, [clientId]);

  async function loadCheckIns() {
    const { data } = await supabase
      .from('check_ins')
      .select('*')
      .eq('user_id', clientId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) setCheckIns(data);
    setLoading(false);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getScoreColor(score: number) {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  }

  if (loading) {
    return <div className="text-gray-500">Loading check-ins...</div>;
  }

  return (
    <div className="space-y-4">
      {checkIns.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No check-ins yet</p>
        </div>
      ) : (
        checkIns.map((checkIn) => (
          <div key={checkIn.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(checkIn.created_at)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Mood</p>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold ${getScoreColor(checkIn.mood_score)}`}>
                  <TrendingUp className="w-4 h-4" />
                  <span>{checkIn.mood_score}/10</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Energy</p>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold ${getScoreColor(checkIn.energy_level)}`}>
                  <TrendingUp className="w-4 h-4" />
                  <span>{checkIn.energy_level}/10</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Sleep</p>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold ${getScoreColor(checkIn.sleep_quality)}`}>
                  <TrendingUp className="w-4 h-4" />
                  <span>{checkIn.sleep_quality}/10</span>
                </div>
              </div>
            </div>

            {checkIn.notes && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">{checkIn.notes}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}