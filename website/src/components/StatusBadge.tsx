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
      className={`inline-flex items-center rounded-md border font-medium ${sizeClass} ${meta.badgeClass}`}
    >
      {meta.label}
    </span>
  );
}
