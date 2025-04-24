import { Badge } from '@/components/shadcn/badge';

type Props = {
  selectedErasLength: number;
  selectedMetersLength: number;
  selectedRhymesLength: number;
  selectedThemesLength: number;

  badgeErasCountText: string;
  badgeMetersCountText: string;
  badgeThemesCountText: string;
  badgeRhymesCountText: string;
};

export function FilterBadges({
  selectedErasLength,
  selectedMetersLength,
  selectedRhymesLength,
  selectedThemesLength,

  badgeErasCountText,
  badgeMetersCountText,
  badgeThemesCountText,
  badgeRhymesCountText,
}: Props) {
  return (
    <div className="flex flex-wrap gap-1 justify-end">
      {selectedErasLength > 0 && (
        <Badge variant="outline" className="text-xs text-zinc-600 border-zinc-200 bg-zinc-50">
          {badgeErasCountText}
        </Badge>
      )}
      {selectedMetersLength > 0 && (
        <Badge variant="outline" className="text-xs text-zinc-600 border-zinc-200 bg-zinc-50">
          {badgeMetersCountText}
        </Badge>
      )}
      {selectedThemesLength > 0 && (
        <Badge variant="outline" className="text-xs text-zinc-600 border-zinc-200 bg-zinc-50">
          {badgeThemesCountText}
        </Badge>
      )}
      {selectedRhymesLength > 0 && (
        <Badge variant="outline" className="text-xs text-zinc-600 border-zinc-200 bg-zinc-50">
          {badgeRhymesCountText}
        </Badge>
      )}
    </div>
  );
}
