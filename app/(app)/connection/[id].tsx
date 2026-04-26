import { useLocalSearchParams } from "expo-router";

import { ConnectionDetailScreen } from "../../../src/screens/ConnectionDetailScreen";

export default function ConnectionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const connectionId = Array.isArray(id) ? id[0] : id;
  return <ConnectionDetailScreen connectionId={connectionId ?? ""} />;
}
