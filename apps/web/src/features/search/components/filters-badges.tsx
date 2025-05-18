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
  const badgeClassname = 'text-xs md:text-sm font-normal text-zinc-600 border-zinc-300/50 bg-white';
  return (
    <div tabIndex={-1} className="flex flex-wrap gap-1 justify-end">
      {selectedErasLength > 0 && (
        <Badge variant="outline" className={badgeClassname}>
          {badgeErasCountText}
        </Badge>
      )}
      {selectedMetersLength > 0 && (
        <Badge variant="outline" className={badgeClassname}>
          {badgeMetersCountText}
        </Badge>
      )}
      {selectedThemesLength > 0 && (
        <Badge variant="outline" className={badgeClassname}>
          {badgeThemesCountText}
        </Badge>
      )}
      {selectedRhymesLength > 0 && (
        <Badge variant="outline" className={badgeClassname}>
          {badgeRhymesCountText}
        </Badge>
      )}
    </div>
  );
}
