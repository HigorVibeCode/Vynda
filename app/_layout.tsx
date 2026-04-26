import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { bypassAuth } from "../src/lib/bypass-auth";
import { colors } from "../src/theme/colors";
import { useAuthStore } from "../src/store/auth-store";

export default function RootLayout() {
  const { bootstrap, loading } = useAuthStore();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (!bypassAuth && loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
