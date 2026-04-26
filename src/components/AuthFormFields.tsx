import { Pressable, Text, TextInput, View } from "react-native";

import { colors } from "../theme/colors";

type Props = {
  email: string;
  password?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  showPassword?: boolean;
  passwordRevealed?: boolean;
  onPasswordRevealChange?: (revealed: boolean) => void;
};

export function AuthFormFields({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  showPassword = true,
  passwordRevealed = false,
  onPasswordRevealChange,
}: Props) {
  const showRevealToggle = Boolean(onPasswordRevealChange);
  return (
    <View style={{ gap: 10 }}>
      <TextInput
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="seu@email.com"
        placeholderTextColor={colors.textSecondary}
        onChangeText={onEmailChange}
        style={{
          backgroundColor: "#131318",
          color: colors.textPrimary,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
        }}
      />
      {showPassword ? (
        <View style={{ position: "relative" }}>
          <TextInput
            value={password}
            secureTextEntry={!passwordRevealed}
            placeholder="Senha"
            placeholderTextColor={colors.textSecondary}
            onChangeText={onPasswordChange}
            style={{
              backgroundColor: "#131318",
              color: colors.textPrimary,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              paddingRight: showRevealToggle ? 90 : 14,
            }}
          />
          {showRevealToggle ? (
            <Pressable
              onPress={() => onPasswordRevealChange?.(!passwordRevealed)}
              hitSlop={8}
              style={{
                position: "absolute",
                right: 6,
                top: 0,
                bottom: 0,
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              <Text style={{ color: colors.primary, fontWeight: "600" }}>
                {passwordRevealed ? "Ocultar" : "Ver"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
