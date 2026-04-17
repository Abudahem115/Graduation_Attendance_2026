export type BatchYear = '2566' | '2567' | '2568' | '2569';

export interface Student {
  student_id: string;
  title_prefix: string;
  full_name: string;
  email: string;
  batch: BatchYear;
  photo_url: string | null;
  created_at: string;
}

export interface LeaderboardEntry {
  batch: BatchYear;
  count: number;
  percentage: number;
  rank: number;
  students: Student[];
}

export const BATCH_COLORS: Record<BatchYear, { from: string; to: string; glow: string }> = {
  '2566': { from: '#6366f1', to: '#8b5cf6', glow: 'rgba(99, 102, 241, 0.4)' },
  '2567': { from: '#f43f5e', to: '#ec4899', glow: 'rgba(244, 63, 94, 0.4)' },
  '2568': { from: '#06b6d4', to: '#3b82f6', glow: 'rgba(6, 182, 212, 0.4)' },
  '2569': { from: '#f59e0b', to: '#ef4444', glow: 'rgba(245, 158, 11, 0.4)' },
};

export const BATCH_LABELS: Record<BatchYear, string> = {
  '2566': 'รุ่น 2566',
  '2567': 'รุ่น 2567',
  '2568': 'รุ่น 2568',
  '2569': 'รุ่น 2569',
};
