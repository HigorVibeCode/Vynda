import { ReactNode } from "react";
import { View, Text } from "react-native";

import { colors } from "../theme/colors";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthCard({ title, subtitle, children }: Props) {
  return (
    <View
      style={{
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 16,
        backgroundColor: colors.card,
      }}
    >
      <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: "700" }}>{title}</Text>
      <Text style={{ color: colors.textSecondary, marginTop: 6, marginBottom: 20 }}>{subtitle}</Text>
      {children}
    </View>
  );
}
