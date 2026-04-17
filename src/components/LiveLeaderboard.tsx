'use client';

import { motion } from 'framer-motion';
import { LeaderboardEntry, BATCH_COLORS, BATCH_LABELS } from '../lib/database.types';
import { StudentCard } from './StudentCard';

interface LiveLeaderboardProps {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
}

export function LiveLeaderboard({ leaderboard, loading }: LiveLeaderboardProps) {
  if (loading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Get top 5 recent students across all batches for the live feed
  const recentStudents = leaderboard
    .flatMap(entry => entry.students)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Batch Progress Bars */}
      <div className="flex flex-col gap-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Live Leaderboard</h2>
        
        <div className="flex flex-col gap-5">
          {leaderboard.map((entry) => {
            const colors = BATCH_COLORS[entry.batch];
            return (
              <motion.div
                key={entry.batch}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span 
                      className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: colors.from }}
                    >
                      {entry.rank}
                    </span>
                    <span className="font-semibold text-white/90">{BATCH_LABELS[entry.batch]}</span>
                  </div>
                  <span className="text-sm font-bold text-white/70">{entry.count} Registered</span>
                </div>
                
                {/* Progress Bar Container */}
                <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
                      boxShadow: `0 0 10px ${colors.glow}`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${entry.percentage}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Live Recent Feed */}
      <div className="flex flex-col gap-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Recent Registrations</h2>
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
        
        <div className="flex flex-col gap-3">
          {recentStudents.length === 0 ? (
            <p className="text-white/50 text-center py-4 text-sm">No registrations yet.</p>
          ) : (
            recentStudents.map((student) => (
              <motion.div
                key={student.student_id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <StudentCard student={student} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
