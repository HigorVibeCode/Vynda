import { useEffect } from "react";
import Animated, { Easing, useAnimatedProps, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import Svg, { Line } from "react-native-svg";

import type { Connection } from "../../types/domain";

const AnimatedLine = Animated.createAnimatedComponent(Line);

type Coord = { connection: Connection; x: number; y: number };

type LineItemProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  connection: Connection;
  flashConnectionId: string | null;
};

function ConnectionLineItem({ x1, y1, x2, y2, connection, flashConnectionId }: LineItemProps) {
  const flash = useSharedValue(0);

  useEffect(() => {
    if (flashConnectionId === connection.id) {
      flash.value = withSequence(
        withTiming(1, { duration: 70, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 260, easing: Easing.in(Easing.quad) })
      );
    }
  }, [flash, flashConnectionId, connection.id]);

  const animatedProps = useAnimatedProps(() => ({
    strokeOpacity: 0.55 + 0.35 * flash.value,
  }));

  return (
    <AnimatedLine
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={connection.color}
      strokeWidth={2}
      strokeLinecap="round"
      animatedProps={animatedProps}
    />
  );
}

type Props = {
  mapSize: number;
  mapCenter: number;
  coords: Coord[];
  flashConnectionId: string | null;
};

export function ConnectionLines({ mapSize, mapCenter, coords, flashConnectionId }: Props) {
  if (coords.length === 0) {
    return null;
  }
  return (
    <Svg width={mapSize} height={mapSize} style={{ position: "absolute", left: 0, top: 0 }}>
      {coords.map(({ connection, x, y }) => (
        <ConnectionLineItem
          key={connection.id}
          x1={mapCenter}
          y1={mapCenter}
          x2={x}
          y2={y}
          connection={connection}
          flashConnectionId={flashConnectionId}
        />
      ))}
    </Svg>
  );
}
