import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Lightbulb } from 'lucide-react';

interface Reflection {
  id: string;
  content: string;
  created_at: string;
}

export function ClientReflectionsTab({ clientId }: { clientId: string }) {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReflections();
  }, [clientId]);

  async function loadReflections() {
    const { data } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', clientId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) setReflections(data);
    setLoading(false);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (loading) {
    return <div className="text-gray-500">Loading reflections...</div>;
  }

  return (
    <div className="space-y-4">
      {reflections.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No reflections yet</p>
        </div>
      ) : (
        reflections.map((reflection) => (
          <div key={reflection.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 mb-2">{reflection.content}</p>
                <p className="text-xs text-gray-500">{formatDate(reflection.created_at)}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}