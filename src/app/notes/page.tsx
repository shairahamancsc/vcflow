'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

type Note = {
  id: number;
  title: string;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const supabase = getSupabase();
      try {
        const { data, error: queryError } = await supabase.from('notes').select();

        if (queryError) {
          throw queryError;
        }

        setNotes(data);
      } catch (e: any) {
        setError(`Error fetching notes: ${e.message}`);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return <div>Loading notes...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h1>Notes from Supabase</h1>
      <pre>{JSON.stringify(notes, null, 2)}</pre>
    </div>
  );
}
