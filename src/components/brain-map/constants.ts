import { MAP_SIZE_BASE, PAGE_GUTTER_X, WEB_MAX_COLUMN } from "./layout";

export const MAP_SIZE = MAP_SIZE_BASE;
export const MAP_CENTER = MAP_SIZE_BASE / 2;

/** Raio da órbita (referência estática; use layout.orbit no mapa). */
export const PILLAR_ORBIT_RADIUS = 128;
export const PILLAR_CLUSTER_WIDTH = 104;
export const PILLAR_CLUSTER_HALF = PILLAR_CLUSTER_WIDTH / 2;
export const PILLAR_ICON_HALF = 52;
export const BRAIN_COLOR = "#7B61FF";
export const BG = "#0B0C14";
export const TEXT = "#F4F4F8";
export const TEXT_MUTED = "#8B8C9F";

export { PAGE_GUTTER_X, WEB_MAX_COLUMN };
/** Alias legado para telas. */
export const WEB_CONTENT_MAX_WIDTH = WEB_MAX_COLUMN;
