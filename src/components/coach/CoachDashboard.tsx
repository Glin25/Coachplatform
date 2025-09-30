import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ClientsList } from './ClientsList';
import { ClientDetailView } from './ClientDetailView';
import { AlertsPanel } from './AlertsPanel';
import { TasksPanel } from './TasksPanel';
import { LogOut, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { signOut } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

export function CoachDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeAlerts: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    if (!profile) return;

    const [clients, alerts, tasks] = await Promise.all([
      supabase.from('coach_client_relationships').select('id', { count: 'exact' }).eq('coach_id', profile.id),
      supabase.from('coach_alerts').select('id', { count: 'exact' }).eq('coach_id', profile.id).eq('status', 'active'),
      supabase.from('coach_tasks').select('id', { count: 'exact' }).eq('coach_id', profile.id).eq('status', 'pending'),
    ]);

    setStats({
      totalClients: clients.count || 0,
      activeAlerts: alerts.count || 0,
      pendingTasks: tasks.count || 0,
    });
  }

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  if (selectedClientId) {
    return (
      <ClientDetailView
        clientId={selectedClientId}
        onBack={() => setSelectedClientId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Coach Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {profile?.full_name}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalClients}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeAlerts}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingTasks}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ClientsList onSelectClient={setSelectedClientId} />
          </div>

          <div className="space-y-6">
            <AlertsPanel onSelectClient={setSelectedClientId} onAlertUpdate={loadStats} />
            <TasksPanel />
          </div>
        </div>
      </main>
    </div>
  );
}