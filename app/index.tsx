import { Redirect } from "expo-router";

import { bypassAuth } from "../src/lib/bypass-auth";
import { useAuthStore } from "../src/store/auth-store";

export default function IndexRoute() {
  const session = useAuthStore((state) => state.session);

  if (bypassAuth) {
    return <Redirect href="/(app)" />;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(app)" />;
}
