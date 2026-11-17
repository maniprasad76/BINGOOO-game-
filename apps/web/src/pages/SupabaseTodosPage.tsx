import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Todo {
  id: string | number;
  name?: string;
  title?: string;
  created_at?: string;
}

export const SupabaseTodosPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTodos() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error: err } = await supabase.from('todos').select();
        if (err) {
          setError(err.message);
        } else {
          setTodos(data || []);
        }
      } catch (e: any) {
        setError(e.message || 'Failed to fetch todos');
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#111111] font-mono p-8">
      <div className="max-w-2xl mx-auto border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000000] p-6">
        <div className="flex items-center gap-3 border-b-4 border-black pb-4 mb-6">
          <div className="w-10 h-10 bg-[#FFD700] border-2 border-black flex items-center justify-center font-black">
            ⚡
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Supabase Todos</h1>
            <p className="text-xs text-gray-600">Connected to omvqrwufoiijjjlxjfac.supabase.co</p>
          </div>
        </div>

        {loading && (
          <div className="py-8 text-center text-sm font-bold animate-pulse">
            LOADING TODOS FROM SUPABASE...
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 border-2 border-red-600 text-red-800 text-xs mb-4">
            <strong>Supabase Notice:</strong> {error}
            <div className="mt-1 text-[11px] text-gray-600">
              Note: If table 'todos' is not yet created in Supabase database, create table 'todos' with column 'name'.
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-2">
            {todos.length === 0 ? (
              <div className="p-4 bg-yellow-50 border-2 border-black text-center text-xs">
                No todos found yet in Supabase table <code className="bg-yellow-200 px-1">todos</code>.
              </div>
            ) : (
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="p-3 border-2 border-black bg-gray-50 flex items-center justify-between shadow-[2px_2px_0px_0px_#000000]"
                  >
                    <span className="font-bold text-sm">{todo.name || todo.title || `Item #${todo.id}`}</span>
                    <span className="text-xs text-gray-500">#{todo.id}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupabaseTodosPage;
