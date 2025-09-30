import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { AlertTriangle, X } from 'lucide-react';

interface Alert {
  id: string;
  client_id: string;
  alert_type: string;
  message: string;
  created_at: string;
  client_name?: string;
}

export function AlertsPanel({ onSelectClient, onAlertUpdate }: { onSelectClient: (id: string) => void; onAlertUpdate: () => void }) {
  const { profile } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, [profile]);

  async function loadAlerts() {
    if (!profile) return;

    const { data } = await supabase
      .from('coach_alerts')
      .select('id, client_id, alert_type, message, created_at, profiles!coach_alerts_client_id_fkey(full_name)')
      .eq('coach_id', profile.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setAlerts(data.map((alert: any) => ({
        ...alert,
        client_name: alert.profiles?.full_name,
      })));
    }

    setLoading(false);
  }

  async function dismissAlert(alertId: string) {
    await supabase
      .from('coach_alerts')
      .update({ status: 'dismissed' })
      .eq('id', alertId);

    setAlerts(alerts.filter(a => a.id !== alertId));
    onAlertUpdate();
  }

  function getAlertColor(type: string) {
    switch (type) {
      case 'missed_checkin': return 'bg-red-50 border-red-200 text-red-800';
      case 'goal_at_risk': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'positive_trend': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Alerts</h2>
        <p className="text-sm text-gray-500">Loading alerts...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Alerts</h2>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No active alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getAlertColor(alert.alert_type)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => onSelectClient(alert.client_id)}
                    className="text-sm font-medium hover:underline text-left"
                  >
                    {alert.client_name}
                  </button>
                  <p className="text-xs mt-1">{alert.message}</p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="flex-shrink-0 p-1 hover:bg-white rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}