import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BG, BRAIN_COLOR, TEXT, TEXT_MUTED } from "../components/brain-map/constants";
import { PillarGlyph } from "../components/brain-map/PillarGlyph";
import { useGameStore } from "../store/game-store";
import { parseConnectionIconKind } from "../types/domain";

type Props = {
  connectionId: string;
};

export function ConnectionDetailScreen({ connectionId }: Props) {
  const router = useRouter();
  const connection = useGameStore((s) => s.connections.find((c) => c.id === connectionId));
  const addGoal = useGameStore((s) => s.addGoal);
  const setGoalStatus = useGameStore((s) => s.setGoalStatus);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const iconKind = useMemo(() => parseConnectionIconKind(connection?.icon), [connection?.icon]);

  const submitGoal = useCallback(() => {
    if (!connection) {
      return;
    }
    addGoal(connection.id, { title, description });
    setTitle("");
    setDescription("");
  }, [addGoal, connection, description, title]);

  if (!connection) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <Text style={styles.missing}>Conexão não encontrada.</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={8}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backHit}>
            <Text style={styles.backChevron}>‹</Text>
            <Text style={styles.backLabel}>Mapa</Text>
          </Pressable>
          <View style={[styles.headerIcon, { backgroundColor: connection.color }]}>
            <PillarGlyph kind={iconKind} color="#FFFFFF" size={24} />
          </View>
          <Text style={styles.headerTitle}>{connection.name}</Text>
          <Text style={styles.headerSub}>Metas só desta conexão</Text>
        </View>

        <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
          {connection.goals.length === 0 ? (
            <Text style={styles.empty}>Ainda sem metas. Adiciona a primeira abaixo.</Text>
          ) : (
            connection.goals.map((goal) => (
              <Pressable
                key={goal.id}
                onPress={() =>
                  setGoalStatus(
                    connection.id,
                    goal.id,
                    goal.status === "completed" ? "active" : "completed"
                  )
                }
                style={[styles.goalCard, goal.status === "completed" && styles.goalCardDone]}
              >
                <View style={[styles.statusDot, goal.status === "completed" && styles.statusDotDone]} />
                <View style={styles.goalBody}>
                  <Text style={[styles.goalTitle, goal.status === "completed" && styles.goalTitleDone]}>
                    {goal.title}
                  </Text>
                  {goal.description ? (
                    <Text style={styles.goalDesc}>{goal.description}</Text>
                  ) : null}
                  <Text style={styles.goalHint}>
                    {goal.status === "completed" ? "Toque para reabrir" : "Toque para concluir"}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>

        <View style={styles.form}>
          <Text style={styles.formLabel}>Nova meta</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Título da meta"
            placeholderTextColor={TEXT_MUTED}
            style={styles.input}
          />
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Descrição (opcional)"
            placeholderTextColor={TEXT_MUTED}
            style={[styles.input, styles.inputMultiline]}
            multiline
          />
          <Pressable onPress={submitGoal} style={styles.addGoalBtn}>
            <Text style={styles.addGoalBtnText}>Adicionar meta</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  flex: {
    flex: 1,
  },
  missing: {
    color: TEXT,
    fontSize: 16,
    padding: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backHit: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  backChevron: {
    color: TEXT_MUTED,
    fontSize: 28,
    marginRight: 2,
    marginTop: -2,
  },
  backLabel: {
    color: TEXT_MUTED,
    fontSize: 16,
    fontWeight: "600",
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerTitle: {
    color: TEXT,
    fontSize: 24,
    fontWeight: "800",
  },
  headerSub: {
    color: TEXT_MUTED,
    fontSize: 14,
    marginTop: 6,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
    gap: 12,
  },
  empty: {
    color: TEXT_MUTED,
    fontSize: 15,
    lineHeight: 22,
  },
  goalCard: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.08)",
  },
  goalCardDone: {
    opacity: 0.72,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  statusDotDone: {
    backgroundColor: BRAIN_COLOR,
  },
  goalBody: {
    flex: 1,
    minWidth: 0,
  },
  goalTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "700",
  },
  goalTitleDone: {
    textDecorationLine: "line-through",
    color: TEXT_MUTED,
  },
  goalDesc: {
    color: TEXT_MUTED,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  goalHint: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 10,
    opacity: 0.8,
  },
  form: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: BG,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  formLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: TEXT,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.1)",
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: "top",
  },
  addGoalBtn: {
    backgroundColor: BRAIN_COLOR,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  addGoalBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  backBtn: {
    marginTop: 12,
    marginLeft: 20,
    alignSelf: "flex-start",
  },
  backText: {
    color: BRAIN_COLOR,
    fontSize: 16,
    fontWeight: "600",
  },
});
