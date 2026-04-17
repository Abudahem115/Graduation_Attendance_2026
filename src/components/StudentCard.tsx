import { Student, BATCH_COLORS, BATCH_LABELS } from '../lib/database.types';

interface StudentCardProps {
  student: Student;
  className?: string;
}

export function StudentCard({ student, className = '' }: StudentCardProps) {
  const batchColor = BATCH_COLORS[student.batch];
  
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 transition-all duration-300 hover:bg-white/10 ${className}`}
      style={{
        boxShadow: `0 4px 20px -2px ${batchColor.glow}`,
      }}
    >
      <div className="flex items-center gap-4">
        {/* Profile Image */}
        <div className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden border-2" style={{ borderColor: batchColor.from }}>
          {student.photo_url ? (
            <img
              src={student.photo_url}
              alt={student.full_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/10 text-white/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="truncate text-lg font-semibold text-white tracking-tight">
            {student.full_name}
          </h3>
          <p className="text-sm text-white/70">ID: {student.student_id}</p>
          
          <div className="mt-1 flex items-center justify-between">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `${batchColor.from}30`, // 30 is hex opacity
                color: batchColor.to,
                border: `1px solid ${batchColor.from}50`,
              }}
            >
              {BATCH_LABELS[student.batch]}
            </span>
            <span className="text-xs text-white/40">
              {new Date(student.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
