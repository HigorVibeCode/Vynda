import Svg, { Path, Rect } from "react-native-svg";

import { BRAIN_COLOR } from "./constants";

type IconProps = { size?: number; color?: string };

export function SparkHudIcon({ size = 16, color = BRAIN_COLOR }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l1.2 4.2L17 7l-3.8 1.4L12 12l-1.2-4.6L7 7l3.8-1.4L12 2zm0 10l.8 2.8L15 15l-2.5.9L12 18l-.5-2.1L9 15l2.5-.9L12 12z"
        fill={color}
        opacity={0.95}
      />
    </Svg>
  );
}

export function PulseHudIcon({ size = 16, color = "#2EC4A0" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12h2l2-6 3 12 2-8 2 2h5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function VyndaMark() {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32">
      <Rect x={1} y={1} width={30} height={30} rx={9} fill="#12131C" stroke="#2A2648" strokeWidth={1} />
      <Path
        d="M16 9c-3.5 0-6 2.2-6.5 5-.2 1.8.3 3.4 1.2 4.5-1 .4-1.7 1.4-1.7 2.6 0 1.6 1.2 2.8 2.8 2.8.6 0 1.1-.2 1.5-.5.4.3.9.5 1.5.5 1.6 0 2.8-1.2 2.8-2.8 0-1.2-.7-2.2-1.7-2.6.9-1.1 1.4-2.7 1.2-4.5C22 11.2 19.5 9 16 9z"
        fill={BRAIN_COLOR}
        opacity={0.92}
      />
      <Path
        d="M13 14c.5 1.2 1.5 2 3 2s2.5-.8 3-2"
        stroke="#0B0C14"
        strokeWidth={0.9}
        strokeLinecap="round"
        fill="none"
        opacity={0.35}
      />
    </Svg>
  );
}
