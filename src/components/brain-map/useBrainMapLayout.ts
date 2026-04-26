import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { BrainMapLayout, resolveBrainMapLayout } from "./layout";

export function useBrainMapLayout(): BrainMapLayout {
  const { width } = useWindowDimensions();
  return useMemo(() => resolveBrainMapLayout(width), [width]);
}
