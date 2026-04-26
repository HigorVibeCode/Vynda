import { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

import type { Connection } from "../../types/domain";
import { useGameStore } from "../../store/game-store";
import { BrainCore } from "./BrainCore";
import { ConnectionLines } from "./ConnectionLines";
import { ConnectionNode } from "./ConnectionNode";
import { useBrainMapLayout } from "./useBrainMapLayout";

type Props = {
  connections: Connection[];
  flashConnectionId: string | null;
  onPressConnection: (connectionId: string) => void;
  onPressBrain: () => void;
};

function orbitForCount(mapSize: number, n: number): number {
  if (n <= 0) {
    return 0;
  }
  const minR = mapSize * 0.24;
  const maxR = mapSize * 0.36;
  const t = (n - 1) / 9;
  return maxR - t * (maxR - minR);
}

export function BrainMapView({ connections, flashConnectionId, onPressConnection, onPressBrain }: Props) {
  const layout = useBrainMapLayout();
  const { mapSize, center } = layout;
  const n = connections.length;
  const orbit = useMemo(() => orbitForCount(mapSize, n), [mapSize, n]);
  const brainSize = Math.round(mapSize * 0.38);
  const brainHit = Math.max(112, Math.round(brainSize * 0.92));
  const hitOffset = brainHit / 2;

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 750, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 750, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [pulse]);

  useEffect(() => {
    if (!flashConnectionId) {
      return undefined;
    }
    const id = setTimeout(() => {
      useGameStore.setState({ brainFlashConnectionId: null });
    }, 400);
    return () => clearTimeout(id);
  }, [flashConnectionId]);

  const coords = useMemo(() => {
    if (n === 0) {
      return [];
    }
    return connections.map((connection, index) => {
      const angle = (index / n) * Math.PI * 2 - Math.PI / 2;
      return {
        connection,
        x: center + Math.cos(angle) * orbit,
        y: center + Math.sin(angle) * orbit,
      };
    });
  }, [connections, n, center, orbit]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.outer}>
      <View style={[styles.mapFrame, { width: mapSize, height: mapSize }]}>
        {n > 0 ? (
          <ConnectionLines mapSize={mapSize} mapCenter={center} coords={coords} flashConnectionId={flashConnectionId} />
        ) : null}
        <Animated.View style={[styles.brainPulse, pulseStyle]} pointerEvents="none">
          <BrainCore mapCenter={center} size={brainSize} />
        </Animated.View>
        {coords.map(({ connection, x, y }) => (
          <ConnectionNode
            key={connection.id}
            connection={connection}
            centerX={x}
            centerY={y}
            onPress={() => onPressConnection(connection.id)}
          />
        ))}
        <Pressable
          onPress={onPressBrain}
          style={({ pressed }) => [
            {
              position: "absolute",
              left: center - hitOffset,
              top: center - hitOffset,
              width: brainHit,
              height: brainHit,
              borderRadius: hitOffset,
            },
            pressed && styles.brainHitPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Gerir conexões"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    overflow: "visible",
  },
  mapFrame: {
    position: "relative",
    overflow: "visible",
  },
  brainPulse: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  brainHitPressed: {
    opacity: 0.85,
  },
});
