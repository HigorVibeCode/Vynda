import { Link, Redirect } from "expo-router";

import { bypassAuth } from "../../src/lib/bypass-auth";
import { useEffect, useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { AuthCard } from "../../src/components/AuthCard";
import { AuthFormFields } from "../../src/components/AuthFormFields";
import { isSupabaseConfigured } from "../../src/lib/supabase";
import { useAuthStore } from "../../src/store/auth-store";
import { colors } from "../../src/theme/colors";

export default function RegisterScreen() {
  const { session, signUpWithEmail, error, clearAuthError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  if (bypassAuth) {
    return <Redirect href="/(app)" />;
  }

  if (session) {
    return <Redirect href="/(app)" />;
  }

  async function handleRegister() {
    if (!isSupabaseConfigured) {
      Alert.alert("Configurar Supabase", "Defina as variaveis de ambiente do Supabase.");
      return;
    }
    const ok = await signUpWithEmail(email, password);
    if (ok) {
      Alert.alert("Conta criada", "Verifique seu email para confirmar o cadastro.");
      return;
    }
    const msg = useAuthStore.getState().error;
    Alert.alert("Falha no cadastro", msg || "Nao foi possivel criar sua conta.");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <AuthCard title="Criar conta" subtitle="Comece sua jornada no Vynda.">
          <AuthFormFields
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
          />
          <Pressable
            onPress={handleRegister}
            style={{ marginTop: 16, backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12 }}
          >
            <Text style={{ color: colors.textPrimary, textAlign: "center", fontWeight: "700" }}>Cadastrar</Text>
          </Pressable>
          {error ? <Text style={{ color: "#ff7f7f", marginTop: 12 }}>{error}</Text> : null}
          <View style={{ marginTop: 16, alignItems: "center" }}>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={{ color: colors.textSecondary }}>Ja tenho conta</Text>
              </Pressable>
            </Link>
          </View>
        </AuthCard>
      </ScrollView>
    </SafeAreaView>
  );
}
