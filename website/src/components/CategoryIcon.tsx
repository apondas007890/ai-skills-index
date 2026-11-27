import {
  Bot,
  CheckSquare,
  Code2,
  Film,
  Layers,
  Music,
  Palette,
  Plug,
  Search,
  Server,
  ShieldCheck,
  TrendingUp,
  Workflow,
  Youtube,
  type LucideProps,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Code2,
  Palette,
  Youtube,
  Bot,
  Plug,
  ShieldCheck,
  Server,
  Film,
  Music,
  Search,
  Workflow,
  TrendingUp,
  CheckSquare,
  Layers,
};

export function CategoryIcon({
  name,
  className = 'h-4 w-4',
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] || Layers;
  return <Icon className={className} aria-hidden="true" />;
}
