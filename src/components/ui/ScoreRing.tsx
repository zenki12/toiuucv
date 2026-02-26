"use client";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showLabel?: boolean;
}

function scoreColor(score: number): string {
  if (score >= 80) return "#4ADE80";
  if (score >= 60) return "#C9A96E";
  if (score >= 40) return "#FBBF24";
  return "#F87171";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Xuất sắc";
  if (score >= 60) return "Tốt";
  if (score >= 40) return "Trung bình";
  return "Cần cải thiện";
}

export default function ScoreRing({
  score,
  size = 120,
  strokeWidth = 6,
  label,
  showLabel = true,
}: ScoreRingProps) {
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle cx={cx} cy={cy} r={r} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
          {/* Progress */}
          <circle cx={cx} cy={cy} r={r} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span className="font-display" style={{ fontSize: size * 0.28, fontWeight: 400, color, lineHeight: 1 }}>
            {score}
          </span>
          {showLabel && (
            <span style={{ fontSize: size * 0.09, color: "rgba(232,224,213,0.4)", marginTop: 2 }}>/ 100</span>
          )}
        </div>
      </div>
      {label && (
        <span className="text-xs tracking-widest uppercase text-center"
          style={{ color: "rgba(232,224,213,0.45)" }}>
          {label}
        </span>
      )}
    </div>
  );
}

export function MiniScore({ score, label }: { score: number; label: string }) {
  const color = scoreColor(score);
  const pct = score + "%";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs tracking-wider" style={{ color: "rgba(232,224,213,0.5)" }}>{label}</span>
        <span className="text-xs font-medium" style={{ color }}>{score}</span>
      </div>
      <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full" style={{
          width: pct, background: color,
          transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
          animation: "progressFill 1s ease forwards",
        }} />
      </div>
    </div>
  );
}
