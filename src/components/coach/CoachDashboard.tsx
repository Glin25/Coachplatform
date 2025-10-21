import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

import ClientsList from '../client/ClientsList';
import ClientDetailView from './ClientDetailView';
import AlertsPanel from './AlertsPanel';
import TasksPanel from './TasksPanel';
import CoachClients from './CoachClients';

// (optioneel) je had deze in je bestand staan; laat ze gerust staan:
import { LogOut, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { signOut } from '../../lib/auth';

export default function CoachDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // client-detail weergave
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // statistieken bovenin
  const [stats, setStats] = useState({
    totalClients: 0,
    activeAlerts: 0,
    pendingTasks: 0,
  });

  // --- NIEUW: koppelen via e-mail ---
  const [clientEmail, setClientEmail] = useState('');
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState<string | null>(null);
  const [linkErr, setLinkErr] = useState<string | null>(null);

  // Als er (net na uitloggen) even geen profiel is: ga terug naar /login
  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    if (!profile) return;

    // Gebruik HEAD + count, dat is het patroon dat je al had
    const [clients, alerts, tasks] = await Promise.all([
      supabase
        .from('coach_client_relationships')
        .select('id', { count: 'exact', head: true })
        .eq('coach_id', profile.id),

      supabase
        .from('coach_alerts')
        .select('id', { count: 'exact', head: true })
        .eq('coach_id', profile.id)
        .eq('status', 'open'),

      supabase
        .from('coach_tasks')
        .select('id', { count: 'exact', head: true })
        .eq('coach_id', profile.id)
        .eq('status', 'open'),
    ]);

    setStats({
      totalClients: clients?.count || 0,
      activeAlerts: alerts?.count || 0,
      pendingTasks: tasks?.count || 0,
    });
  }

  async function handleLinkClient() {
    setLinkMsg(null);
    setLinkErr(null);

    if (!profile?.email) {
      setLinkErr('Kan coach e-mailadres niet bepalen.');
      return;
    }
    if (!clientEmail.trim()) {
      setLinkErr('Vul het e-mailadres van de cliënt in.');
      return;
    }

    try {
      setLinking(true);

      const { error } = await supabase.rpc('link_client_to_coach', {
        coach_email: profile.email,           // huidige coach
        client_email: clientEmail.trim(),     // te koppelen cliënt
      });

      if (error) throw error;

      setLinkMsg('Cliënt is gekoppeld 👍');
      setClientEmail('');
      await loadStats(); // aantal cliënten direct verversen
    } catch (e: any) {
      setLinkErr(e?.message ?? 'Er ging iets mis bij koppelen.');
    } finally {
      setLinking(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate('/login', { replace: true });
  }

  // Detailweergave van een geselecteerde cliënt
  if (selectedClientId) {
    return (
      <ClientDetailView
        clientId={selectedClientId}
        onBack={() => setSelectedClientId(null)}
      />
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Coach Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {profile.full_name}</p>
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

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Top stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalClients}</p>
              </div>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeAlerts}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingTasks}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ClientList onSelectClient={setSelectedClientId} />
          </div>

          <div className="space-y-6">
            <AlertsPanel
              onSelectClient={setSelectedClientId}
              onAlertUpdate={loadStats}
            />
            <TasksPanel />
          </div>
        </div>

      return (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Coach Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back, {profile?.full_name}</p>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ===== Statistieken bovenin ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
          <p className="text-sm text-gray-500">Total Clients</p>
          <p className="text-3xl font-bold mt-2">{stats.totalClients}</p>
        </div>
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
          <p className="text-sm text-gray-500">Active Alerts</p>
          <p className="text-3xl font-bold mt-2">{stats.activeAlerts}</p>
        </div>
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
          <p className="text-sm text-gray-500">Pending Tasks</p>
          <p className="text-3xl font-bold mt-2">{stats.pendingTasks}</p>
        </div>
      </div>

      {/* ===== Lijst van cliënten ===== */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Mijn cliënten</h2>

        {/* Hier renderen we de ClientsList component */}
        <ClientsList onSelectClient={setSelectedClientId} />
      </section>
    </main>
  </div>
);
}