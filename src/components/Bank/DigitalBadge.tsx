import { getScoreTier, getScoreTierLabel, getScoreColor } from '../../types';

interface DigitalBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function DigitalBadge({ score, size = 'md' }: DigitalBadgeProps) {
  const tier = getScoreTier(score);
  const label = getScoreTierLabel(score);
  const color = getScoreColor(score);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ${sizeClasses[size]}`}
      style={{
        backgroundColor: color,
        color: '#000',
        border: '2px solid #000',
      }}
      title={`Digital Score: ${score}/100 — ${label}`}
      data-tier={tier}
    >
      <span className={`${dotSize[size]} rounded-full`} style={{ backgroundColor: '#000' }} />
      {label}
    </span>
  );
}
