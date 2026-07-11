/** Category colors cycled across building cards, in display order. */
const ILLUSTRATION_COLORS = ["#0C5678", "#B8720F", "#0E8C7F"] as const;

function tint(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const mix = (channel: number) => Math.round(channel + (255 - channel) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

export function buildingIllustrationColor(index: number): string {
  return ILLUSTRATION_COLORS[index % ILLUSTRATION_COLORS.length];
}

interface BuildingIllustrationProps {
  color: string;
}

/** Drawn skyline placeholder — three buildings, sun and clouds — tinted per category color. */
export function BuildingIllustration({ color }: BuildingIllustrationProps) {
  const bg = tint(color, 0.86);

  return (
    <svg
      viewBox="0 0 300 200"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 h-full w-full"
      style={{ background: bg }}
      aria-hidden="true"
    >
      <circle cx="246" cy="52" r="25" fill="#A9BAC0" opacity="0.55" />
      <g fill="#FFFFFF" opacity="0.85">
        <circle cx="230" cy="66" r="15" />
        <circle cx="250" cy="58" r="19" />
        <circle cx="270" cy="68" r="13" />
        <rect x="222" y="64" width="60" height="18" rx="9" />
      </g>
      <g fill="#FFFFFF" opacity="0.7">
        <circle cx="98" cy="62" r="10" />
        <circle cx="112" cy="56" r="13" />
        <circle cx="127" cy="63" r="9" />
        <rect x="90" y="60" width="44" height="13" rx="6.5" />
      </g>

      <rect x="66" y="118" width="66" height="106" rx="10" fill={color} opacity="0.4" />
      <g fill={bg}>
        <rect x="78" y="134" width="13" height="15" rx="2" />
        <rect x="100" y="134" width="13" height="15" rx="2" />
        <rect x="78" y="160" width="13" height="15" rx="2" />
        <rect x="100" y="160" width="13" height="15" rx="2" />
        <rect x="78" y="186" width="13" height="15" rx="2" />
        <rect x="100" y="186" width="13" height="15" rx="2" />
      </g>

      <rect x="196" y="102" width="62" height="122" rx="10" fill={color} opacity="0.65" />
      <g fill={bg}>
        <rect x="207" y="118" width="12" height="14" rx="2" />
        <rect x="228" y="118" width="12" height="14" rx="2" />
        <rect x="207" y="142" width="12" height="14" rx="2" />
        <rect x="228" y="142" width="12" height="14" rx="2" />
        <rect x="207" y="166" width="12" height="14" rx="2" />
        <rect x="228" y="166" width="12" height="14" rx="2" />
        <rect x="207" y="190" width="12" height="14" rx="2" />
        <rect x="228" y="190" width="12" height="14" rx="2" />
      </g>

      <rect x="122" y="70" width="76" height="154" rx="12" fill={color} />
      <g fill={bg}>
        <rect x="136" y="88" width="14" height="16" rx="2.5" />
        <rect x="160" y="88" width="14" height="16" rx="2.5" />
        <rect x="136" y="116" width="14" height="16" rx="2.5" />
        <rect x="160" y="116" width="14" height="16" rx="2.5" />
        <rect x="136" y="144" width="14" height="16" rx="2.5" />
        <rect x="160" y="144" width="14" height="16" rx="2.5" />
        <rect x="136" y="172" width="14" height="16" rx="2.5" />
        <rect x="160" y="172" width="14" height="16" rx="2.5" />
        <rect x="147" y="200" width="20" height="24" rx="4" />
      </g>
    </svg>
  );
}
