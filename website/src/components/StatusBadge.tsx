import { STATUS_META } from '../lib/constants';
import type { SkillStatus } from '../types/skill';

export function StatusBadge({
  status,
  size = 'sm',
}: {
  status: SkillStatus;
  size?: 'xs' | 'sm';
}) {
  const meta = STATUS_META[status] || STATUS_META['needs-review'];
  const sizeClass =
    size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      title={meta.description}
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClass} ${meta.badgeClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
      {meta.label}
    </span>
  );
}
