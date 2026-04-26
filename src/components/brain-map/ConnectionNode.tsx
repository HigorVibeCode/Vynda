import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";

import { getConnectionProgressPercent } from "../../lib/connection-progress";
import type { Connection } from "../../types/domain";
import { parseConnectionIconKind } from "../../types/domain";
import { PILLAR_CLUSTER_HALF, PILLAR_CLUSTER_WIDTH, PILLAR_ICON_HALF, TEXT } from "./constants";
import { PillarGlyph } from "./PillarGlyph";

type Props = {
  connection: Connection;
  centerX: number;
  centerY: number;
  onPress: () => void;
};

const RING_R = 30;
const CORE = 40;
const LABEL_MAX = 11;

export function ConnectionNode({ connection, centerX, centerY, onPress }: Props) {
  const glow = useSharedValue(0);
  const progress = getConnectionProgressPercent(connection);
  const circum = 2 * Math.PI * RING_R;
  const arcPortion = 0.78;
  const dashMain = (Math.min(100, progress) / 100) * circum * arcPortion;
  const iconKind = parseConnectionIconKind(connection.icon);

  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, [glow]);

  const ringStyle = useAnimatedStyle(() => {
    const s = 1 + glow.value * 0.05;
    return { opacity: 0.35 + glow.value * 0.28, transform: [{ scale: s }] };
  });

  const left = centerX - PILLAR_CLUSTER_HALF;
  const top = centerY - PILLAR_ICON_HALF;

  return (
    <View style={[styles.cluster, { left, top, width: PILLAR_CLUSTER_WIDTH }]} pointerEvents="box-none">
      <View style={styles.svgWrap}>
        <Svg width={PILLAR_CLUSTER_WIDTH} height={PILLAR_CLUSTER_WIDTH}>
          <G transform={`rotate(-90 ${PILLAR_CLUSTER_HALF} ${PILLAR_CLUSTER_HALF})`}>
            <Circle
              cx={PILLAR_CLUSTER_HALF}
              cy={PILLAR_CLUSTER_HALF}
              r={RING_R}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={3}
              fill="none"
            />
            <Circle
              cx={PILLAR_CLUSTER_HALF}
              cy={PILLAR_CLUSTER_HALF}
              r={RING_R}
              stroke={connection.color}
              strokeWidth={3}
              fill="none"
              strokeDasharray={`${dashMain} ${circum}`}
              strokeLinecap="round"
              opacity={0.95}
            />
          </G>
        </Svg>
        <Animated.View pointerEvents="none" style={[styles.outerGlow, { borderColor: connection.color }, ringStyle]} />
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [styles.coreHit, { backgroundColor: connection.color }, pressed && styles.corePressed]}
        >
          <PillarGlyph kind={iconKind} color="#FFFFFF" size={22} />
        </Pressable>
      </View>
      <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
        {connection.name}
      </Text>
    </View>
  );
}

const coreOffset = PILLAR_CLUSTER_HALF - CORE / 2;

const styles = StyleSheet.create({
  cluster: {
    position: "absolute",
    alignItems: "center",
  },
  svgWrap: {
    width: PILLAR_CLUSTER_WIDTH,
    height: PILLAR_CLUSTER_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  coreHit: {
    position: "absolute",
    left: coreOffset,
    top: coreOffset,
    width: CORE,
    height: CORE,
    borderRadius: CORE / 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  corePressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  outerGlow: {
    position: "absolute",
    left: coreOffset - 4,
    top: coreOffset - 4,
    width: CORE + 8,
    height: CORE + 8,
    borderRadius: (CORE + 8) / 2,
    borderWidth: 2,
    zIndex: 2,
  },
  label: {
    marginTop: 4,
    color: TEXT,
    fontSize: LABEL_MAX,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: PILLAR_CLUSTER_WIDTH + 8,
    opacity: 0.92,
  },
});
