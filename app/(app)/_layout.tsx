import { Redirect, Stack } from "expo-router";

import { bypassAuth } from "../../src/lib/bypass-auth";
import { useAuthStore } from "../../src/store/auth-store";

export default function AppLayout() {
  const session = useAuthStore((state) => state.session);

  if (!bypassAuth && !session) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
