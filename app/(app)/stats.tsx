import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BG, TEXT, TEXT_MUTED } from "../../src/components/brain-map/constants";
import { useGameStore } from "../../src/store/game-store";

export default function StatsScreen() {
  const router = useRouter();
  const connections = useGameStore((s) => s.connections);

  const totalGoals = connections.reduce((acc, c) => acc + c.goals.length, 0);
  const completedGoals = connections.reduce(
    (acc, c) => acc + c.goals.filter((g) => g.status === "completed").length,
    0
  );

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <Text style={styles.title}>Visão geral</Text>
      <Text style={styles.sub}>Resumo das tuas conexões e metas.</Text>

      <View style={styles.block}>
        <Row label="Conexões" value={String(connections.length)} />
        <Row label="Metas" value={String(totalGoals)} />
        <Row label="Metas concluídas" value={String(completedGoals)} />
      </View>

      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>Voltar ao mapa</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  title: {
    color: TEXT,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  sub: {
    color: TEXT_MUTED,
    fontSize: 14,
    marginBottom: 22,
  },
  block: {
    gap: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: TEXT_MUTED,
    fontSize: 15,
  },
  value: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "600",
  },
  back: {
    marginTop: 36,
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  backText: {
    color: TEXT_MUTED,
    fontSize: 15,
  },
});
