import { Badge } from "@/components/ui/badge";
import { CATEGORY_COLORS, type Category } from "@/types/domain";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: Category;
  label: string;
  /** Over a photo the dim fill lacks contrast, so switch to a solid surface background. */
  onImage?: boolean;
}

export function CategoryBadge({ category, label, onImage }: CategoryBadgeProps) {
  const colors = CATEGORY_COLORS[category];

  return (
    <Badge
      variant="secondary"
      className={cn("border-transparent", onImage && "bg-surface shadow-sm")}
      style={
        onImage
          ? { color: colors.text }
          : { backgroundColor: colors.fill, color: colors.text }
      }
    >
      {label}
    </Badge>
  );
}
