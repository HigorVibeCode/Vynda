import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrainMapView } from "../components/brain-map/BrainMapView";
import { BG, PAGE_GUTTER_X, WEB_MAX_COLUMN } from "../components/brain-map/constants";
import { ConnectionsModal } from "../components/ConnectionsModal";
import { useGameStore } from "../store/game-store";

export function BrainMapScreen() {
  const router = useRouter();
  const connections = useGameStore((s) => s.connections);
  const flashId = useGameStore((s) => s.brainFlashConnectionId);
  const [manageOpen, setManageOpen] = useState(false);

  const safeStyle: ViewStyle[] = [styles.safe];
  if (Platform.OS === "web") {
    safeStyle.push({ width: "100%", minHeight: "100vh" } as unknown as ViewStyle);
  }

  return (
    <SafeAreaView style={safeStyle} edges={["top", "left", "right"]}>
      <View style={styles.page}>
        <View style={styles.column}>
          <View style={styles.mapSlot}>
            <BrainMapView
              connections={connections}
              flashConnectionId={flashId}
              onPressConnection={(id) => router.push(`/(app)/connection/${id}`)}
              onPressBrain={() => setManageOpen(true)}
            />
          </View>
        </View>
      </View>

      <ConnectionsModal visible={manageOpen} onClose={() => setManageOpen(false)} />
    </SafeAreaView>
  );
}

const columnStyle = {
  width: "100%" as const,
  maxWidth: WEB_MAX_COLUMN,
  flex: 1,
  paddingHorizontal: PAGE_GUTTER_X,
  ...(Platform.OS === "web" ? { alignSelf: "center" as const } : {}),
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  page: {
    flex: 1,
    width: "100%",
    ...(Platform.OS === "web" ? { alignItems: "stretch" as const } : {}),
  },
  column: columnStyle,
  mapSlot: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
});
