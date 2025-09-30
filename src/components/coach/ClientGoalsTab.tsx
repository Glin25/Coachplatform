import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Target, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description?: string;
  target_date?: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
}

export function ClientGoalsTab({ clientId }: { clientId: string }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, [clientId]);

  async function loadGoals() {
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', clientId)
      .order('created_at', { ascending: false });

    if (data) setGoals(data);
    setLoading(false);
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Completed
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 text-gray-700 text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            Paused
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
            <Clock className="w-4 h-4" />
            Active
          </span>
        );
    }
  }

  function formatDate(dateString?: string) {
    if (!dateString) return 'No target date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (loading) {
    return <div className="text-gray-500">Loading goals...</div>;
  }

  return (
    <div className="space-y-4">
      {goals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No goals yet</p>
        </div>
      ) : (
        goals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                  )}
                  <p className="text-xs text-gray-500">Target: {formatDate(goal.target_date)}</p>
                </div>
              </div>
              {getStatusBadge(goal.status)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}