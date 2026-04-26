import { Platform } from "react-native";

/** Tamanho de referência do mapa (nativo). */
export const MAP_SIZE_BASE = 400;

/** Raio da órbita no tamanho base. */
export const PILLAR_ORBIT_BASE = 128;

/** Largura máxima da coluna de conteúdo (web). */
export const WEB_MAX_COLUMN = 520;

/** Mesmo valor usado na tela para `paddingHorizontal` (deve bater com o cálculo do mapa). */
export const PAGE_GUTTER_X = 20;

export type BrainMapLayout = {
  mapSize: number;
  center: number;
  orbit: number;
};

const MAP_MIN_WEB = 280;

/**
 * Largura útil = min(coluna máx., viewport) - gutters.
 * O mapa nunca ultrapassa essa largura (evita desalinhamento web).
 */
export function resolveBrainMapLayout(windowWidth: number): BrainMapLayout {
  let mapSize = MAP_SIZE_BASE;

  if (Platform.OS === "web") {
    const inner = Math.min(WEB_MAX_COLUMN, windowWidth) - PAGE_GUTTER_X * 2;
    const safeInner = Math.max(MAP_MIN_WEB, Math.floor(inner));
    mapSize = Math.min(MAP_SIZE_BASE, safeInner);
  }

  const scale = mapSize / MAP_SIZE_BASE;
  return {
    mapSize,
    center: mapSize / 2,
    orbit: PILLAR_ORBIT_BASE * scale,
  };
}
