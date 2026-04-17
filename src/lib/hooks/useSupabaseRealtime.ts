import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabase/client';
import { Student, LeaderboardEntry, BatchYear } from '../database.types';

export function useSupabaseRealtime() {
  const [students, setStudents] = useState<Student[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateLeaderboard = useCallback((allStudents: Student[]) => {
    const batches: BatchYear[] = ['2566', '2567', '2568', '2569'];
    const totalCount = allStudents.length;

    let entries: LeaderboardEntry[] = batches.map((batch) => {
      const batchStudents = allStudents.filter((s) => s.batch === batch);
      return {
        batch,
        count: batchStudents.length,
        percentage: totalCount > 0 ? (batchStudents.length / totalCount) * 100 : 0,
        rank: 0,
        students: batchStudents.slice(0, 5), // Keep top 5 latest students per batch for display
      };
    });

    // Sort by count descending
    entries.sort((a, b) => b.count - a.count);

    // Assign ranks
    entries = entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    setLeaderboard(entries);
  }, []);

  // Initial fetch
  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching students:', error);
      } else {
        setStudents(data as Student[]);
        calculateLeaderboard(data as Student[]);
      }
      setLoading(false);
    };

    fetchStudents();
  }, [calculateLeaderboard]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('public:students')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        (payload) => {
          setStudents((current) => {
            let updated = [...current];

            if (payload.eventType === 'INSERT') {
              updated = [payload.new as Student, ...updated];
            } else if (payload.eventType === 'UPDATE') {
              updated = updated.map((s) =>
                s.student_id === payload.new.student_id ? (payload.new as Student) : s
              );
            } else if (payload.eventType === 'DELETE') {
              updated = updated.filter((s) => s.student_id !== payload.old.student_id);
            }

            // Sort by created_at descending
            updated.sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            // Re-calculate the leaderboard
            calculateLeaderboard(updated);
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [calculateLeaderboard]);

  return { students, leaderboard, loading };
}
