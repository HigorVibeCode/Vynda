import { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { CONNECTION_COLOR_PRESETS, CONNECTION_ICON_OPTIONS, MAX_CONNECTIONS } from "../data/connection-presets";
import { useGameStore } from "../store/game-store";
import type { PillarIconKind } from "../types/domain";
import { PillarGlyph } from "./brain-map/PillarGlyph";
import { BG, BRAIN_COLOR, TEXT, TEXT_MUTED } from "./brain-map/constants";
import { colors } from "../theme/colors";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ConnectionsModal({ visible, onClose }: Props) {
  const connections = useGameStore((s) => s.connections);
  const addConnection = useGameStore((s) => s.addConnection);
  const removeConnection = useGameStore((s) => s.removeConnection);

  const [name, setName] = useState("");
  const [color, setColor] = useState(CONNECTION_COLOR_PRESETS[0]);
  const [icon, setIcon] = useState<PillarIconKind | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const atLimit = connections.length >= MAX_CONNECTIONS;

  const resetForm = useCallback(() => {
    setName("");
    setColor(CONNECTION_COLOR_PRESETS[0]);
    setIcon(undefined);
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const onAdd = useCallback(() => {
    setError(null);
    if (atLimit) {
      setError(`Máximo de ${MAX_CONNECTIONS} conexões.`);
      return;
    }
    const ok = addConnection({ name, color, icon });
    if (!ok) {
      setError("Indica um nome para a conexão.");
      return;
    }
    resetForm();
  }, [addConnection, atLimit, color, icon, name, resetForm]);

  const iconOptions = useMemo(() => CONNECTION_ICON_OPTIONS, []);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}
      >
        <Pressable style={styles.scrim} onPress={handleClose} accessibilityLabel="Fechar" />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.title}>Conexões</Text>
            <Pressable onPress={handleClose} hitSlop={12}>
              <Text style={styles.close}>Fechar</Text>
            </Pressable>
          </View>
          <Text style={styles.sub}>
            Cada conexão é uma área da tua vida. Máximo {MAX_CONNECTIONS}. Toque no cérebro no mapa para voltar aqui.
          </Text>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sectionLabel}>As tuas conexões</Text>
            {connections.length === 0 ? (
              <Text style={styles.empty}>Ainda não criaste nenhuma. Adiciona abaixo.</Text>
            ) : (
              connections.map((c) => (
                <View key={c.id} style={styles.row}>
                  <View style={[styles.dot, { backgroundColor: c.color }]} />
                  <View style={styles.rowText}>
                    <Text style={styles.rowName}>{c.name}</Text>
                    <Text style={styles.rowMeta}>{c.goals.length} metas</Text>
                  </View>
                  <Pressable onPress={() => removeConnection(c.id)} hitSlop={8} style={styles.remove}>
                    <Text style={styles.removeText}>Remover</Text>
                  </Pressable>
                </View>
              ))
            )}

            <Text style={[styles.sectionLabel, styles.sectionSpaced]}>Nova conexão</Text>
            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ex.: Saúde, Carreira…"
              placeholderTextColor={TEXT_MUTED}
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Cor</Text>
            <View style={styles.colorRow}>
              {CONNECTION_COLOR_PRESETS.map((hex) => (
                <Pressable
                  key={hex}
                  onPress={() => setColor(hex)}
                  style={[styles.colorSwatch, { backgroundColor: hex }, color === hex && styles.colorSwatchOn]}
                />
              ))}
            </View>

            <Text style={styles.inputLabel}>Ícone (opcional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconRow}>
              <Pressable
                onPress={() => setIcon(undefined)}
                style={[styles.iconChip, !icon && styles.iconChipOn]}
              >
                <Text style={styles.iconChipText}>Nenhum</Text>
              </Pressable>
              {iconOptions.map((opt) => (
                <Pressable
                  key={opt.kind}
                  onPress={() => setIcon(icon === opt.kind ? undefined : opt.kind)}
                  style={[styles.iconChip, icon === opt.kind && styles.iconChipOn]}
                >
                  <PillarGlyph kind={opt.kind} color={icon === opt.kind ? BRAIN_COLOR : TEXT} size={22} />
                </Pressable>
              ))}
            </ScrollView>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              onPress={onAdd}
              disabled={atLimit}
              style={[styles.addBtn, atLimit && styles.addBtnDisabled]}
            >
              <Text style={styles.addBtnText}>{atLimit ? "Limite atingido" : "Adicionar conexão"}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    maxHeight: "88%",
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  close: {
    color: TEXT_MUTED,
    fontSize: 16,
    fontWeight: "600",
  },
  sub: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },
  scroll: {
    marginTop: 16,
    maxHeight: 480,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionLabel: {
    color: TEXT,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    opacity: 0.85,
  },
  sectionSpaced: {
    marginTop: 22,
  },
  empty: {
    color: TEXT_MUTED,
    fontSize: 15,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  rowMeta: {
    color: TEXT_MUTED,
    fontSize: 13,
    marginTop: 2,
  },
  remove: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  removeText: {
    color: "#F87171",
    fontSize: 14,
    fontWeight: "600",
  },
  inputLabel: {
    color: TEXT_MUTED,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: BG,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: TEXT,
    fontSize: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.12)",
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorSwatchOn: {
    borderColor: "#fff",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  iconChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconChipOn: {
    borderColor: BRAIN_COLOR,
    backgroundColor: "rgba(123,97,255,0.15)",
  },
  iconChipText: {
    color: TEXT_MUTED,
    fontSize: 11,
    fontWeight: "600",
  },
  error: {
    color: "#F87171",
    marginTop: 12,
    fontSize: 14,
  },
  addBtn: {
    marginTop: 20,
    backgroundColor: BRAIN_COLOR,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  addBtnDisabled: {
    opacity: 0.45,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
