import { buildingContent } from "@/content/building";
import { UNIT_STATUS_COLORS } from "@/types/domain";

export function StatusLegend() {
  return (
    <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 px-1">
      {buildingContent.legendOrder.map((status) => {
        const colors = UNIT_STATUS_COLORS[status];
        return (
          <li
            key={status}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-copy-secondary"
          >
            <span
              className="h-3.5 w-3.5 rounded-[5px] border-[1.5px]"
              style={{ background: colors.fill, borderColor: colors.border }}
            />
            {buildingContent.unitStatusLabels[status]}
          </li>
        );
      })}
    </ul>
  );
}
