import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { CheckCircle, Circle, Plus, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  due_date?: string;
  client_id?: string;
}

export function TasksPanel() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [profile]);

  async function loadTasks() {
    if (!profile) return;

    const { data } = await supabase
      .from('coach_tasks')
      .select('*')
      .eq('coach_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) setTasks(data);
    setLoading(false);
  }

  async function addTask() {
    if (!profile || !newTaskTitle.trim()) return;

    const { error } = await supabase.from('coach_tasks').insert({
      coach_id: profile.id,
      title: newTaskTitle,
      status: 'pending',
    });

    if (!error) {
      setNewTaskTitle('');
      setShowAddTask(false);
      loadTasks();
    }
  }

  async function toggleTask(taskId: string, currentStatus: string) {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    await supabase
      .from('coach_tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  }

  async function deleteTask(taskId: string) {
    await supabase.from('coach_tasks').delete().eq('id', taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks & Reminders</h2>
        <p className="text-sm text-gray-500">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Tasks & Reminders</h2>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {showAddTask && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="New task..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            autoFocus
          />
          <button
            onClick={addTask}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Add
          </button>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No tasks yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg group"
            >
              <button
                onClick={() => toggleTask(task.id, task.status)}
                className="flex-shrink-0"
              >
                {task.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <span className={`flex-1 text-sm ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}