import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { CheckInForm } from './CheckInForm';
import { GoalsList } from './GoalsList';
import { ReflectionCard } from './ReflectionCard';
import { TrendsChart } from './TrendsChart';
import { LogOut, Target, TrendingUp, Calendar } from 'lucide-react';
import { signOut } from '../../lib/auth';
import { useNavigate, Navigate } from 'react-router-dom';

export function ClientDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [stats, setStats] = useState({
    totalCheckIns: 0,
    activeGoals: 0,
    streak: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
   if (!profile) {
  return <Navigate to="/login" replace />;
}

    const [checkIns, goals] = await Promise.all([
      supabase.from('check_ins').select('id', { count: 'exact' }).eq('user_id', profile.id),
      supabase.from('goals').select('id', { count: 'exact' }).eq('user_id', profile.id).eq('status', 'active'),
    ]);

    setStats({
      totalCheckIns: checkIns.count || 0,
      activeGoals: goals.count || 0,
      streak: 0,
    });
  }

  async function handleSignOut() {
  await signOut();  
  navigate('/login', { replace: true }); 
}

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.full_name}</h1>
            <p className="text-sm text-gray-600">Track your progress and achieve your goals</p>
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
                <p className="text-sm text-gray-600">Total Check-ins</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCheckIns}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeGoals}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Day Streak</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.streak}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Daily Check-in</h2>
                <button
                  onClick={() => setShowCheckIn(!showCheckIn)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {showCheckIn ? 'Hide' : 'New Check-in'}
                </button>
              </div>
              {showCheckIn && (
                <CheckInForm
                  onSuccess={() => {
                    setShowCheckIn(false);
                    loadStats();
                  }}
                />
              )}
            </div>

            <TrendsChart />
          </div>

          <div className="space-y-6">
            <GoalsList onUpdate={loadStats} />
            <ReflectionCard />
          </div>
        </div>
      </main>
    </div>
  );
}