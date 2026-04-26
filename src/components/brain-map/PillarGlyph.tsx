import Svg, { Circle, Path, Rect } from "react-native-svg";

import { PillarIconKind } from "../../types/domain";

type Props = {
  kind: PillarIconKind;
  color: string;
  size?: number;
};

export function PillarGlyph({ kind, color, size = 20 }: Props) {
  const s = size;
  const vb = 24;
  const stroke = color;
  const fill = color;

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${vb} ${vb}`}>
      {kind === "espiritual" ? (
        <Path
          d="M12 3c-1.5 2.5-3 5.5-3 9a3 3 0 006 0c0-3.5-1.5-6.5-3-9zm0 12v6"
          stroke={stroke}
          strokeWidth={1.6}
          strokeLinecap="round"
          fill="none"
        />
      ) : null}
      {kind === "financeiro" ? (
        <>
          <Circle cx={12} cy={12} r={7} stroke={stroke} strokeWidth={1.6} fill="none" />
          <Path d="M12 8v8M9.5 10h5M9.5 14h5" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" />
        </>
      ) : null}
      {kind === "carreira" ? (
        <Path
          d="M8 10V8a1 1 0 011-1h6a1 1 0 011 1v2M7 10h10v9H7V10zm3 4h4"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
          fill="none"
        />
      ) : null}
      {kind === "criatividade" ? (
        <Path
          d="M12 4v2M12 17a4 4 0 100-8 4 4 0 000 8z"
          stroke={stroke}
          strokeWidth={1.6}
          strokeLinecap="round"
          fill="none"
        />
      ) : null}
      {kind === "lazer" ? (
        <>
          <Rect x={6} y={9} width={12} height={8} rx={2} stroke={stroke} strokeWidth={1.5} fill="none" />
          <Path d="M9 17v2M15 17v2M10 7l-1-2M14 7l1-2" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" />
        </>
      ) : null}
      {kind === "proposito" ? (
        <>
          <Circle cx={12} cy={12} r={7} stroke={stroke} strokeWidth={1.5} fill="none" />
          <Circle cx={12} cy={12} r={2.5} fill={fill} />
        </>
      ) : null}
      {kind === "fisico" ? (
        <Path
          d="M7 14h3v5H7v-5zm7 0h3v5h-3v-5zM8 14V9l4-3 4 3v5"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
          fill="none"
        />
      ) : null}
      {kind === "mental" ? (
        <Path
          d="M8.5 11c0-2 1.5-3.5 3.5-3.5S15.5 9 15.5 11c1 0 1.8.8 1.8 1.8 0 .9-.6 1.6-1.4 1.8.2.3.3.7.3 1.1 0 1.2-1 2.2-2.2 2.2H9.2C8 18 7 17 7 15.8c0-.4.1-.8.3-1.1-.8-.2-1.4-.9-1.4-1.8 0-1 .8-1.8 1.8-1.8z"
          stroke={stroke}
          strokeWidth={1.4}
          fill="none"
        />
      ) : null}
      {kind === "relacionamentos" ? (
        <>
          <Circle cx={9} cy={11} r={2.5} stroke={stroke} strokeWidth={1.4} fill="none" />
          <Circle cx={15} cy={11} r={2.5} stroke={stroke} strokeWidth={1.4} fill="none" />
          <Path d="M9 16c1 1.5 2.5 2.5 3 2.5s2-1 3-2.5" stroke={stroke} strokeWidth={1.4} fill="none" strokeLinecap="round" />
        </>
      ) : null}
      {kind === "desenvolvimento" ? (
        <Path
          d="M8 6h8v12H8V6zm2 3h4M10 12h4"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
        />
      ) : null}
      {kind === "saude" ? (
        <Path
          d="M12 19s-6-4.2-6-9a4 4 0 018 0c0 4.8-6 9-6 9z"
          stroke={stroke}
          strokeWidth={1.5}
          fill="none"
          strokeLinejoin="round"
        />
      ) : null}
    </Svg>
  );
}
