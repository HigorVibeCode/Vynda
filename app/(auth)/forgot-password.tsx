import { Link, Redirect } from "expo-router";

import { bypassAuth } from "../../src/lib/bypass-auth";
import { useEffect, useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { AuthCard } from "../../src/components/AuthCard";
import { AuthFormFields } from "../../src/components/AuthFormFields";
import { isSupabaseConfigured } from "../../src/lib/supabase";
import { useAuthStore } from "../../src/store/auth-store";
import { colors } from "../../src/theme/colors";

export default function ForgotPasswordScreen() {
  const { recoverPassword, error, clearAuthError } = useAuthStore();
  const [email, setEmail] = useState("");

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  if (bypassAuth) {
    return <Redirect href="/(app)" />;
  }

  async function handleRecover() {
    if (!isSupabaseConfigured) {
      Alert.alert("Configurar Supabase", "Defina as variaveis de ambiente do Supabase.");
      return;
    }
    const ok = await recoverPassword(email);
    if (ok) {
      Alert.alert("Email enviado", "Confira sua caixa de entrada (e spam) para redefinir a senha.");
      return;
    }
    const msg = useAuthStore.getState().error;
    Alert.alert("Falha na recuperacao", msg || "Nao foi possivel enviar o email.");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <AuthCard title="Recuperar senha" subtitle="Enviaremos um link para redefinicao de senha.">
          <AuthFormFields email={email} onEmailChange={setEmail} showPassword={false} />
          <Pressable
            onPress={handleRecover}
            style={{ marginTop: 16, backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12 }}
          >
            <Text style={{ color: colors.textPrimary, textAlign: "center", fontWeight: "700" }}>Enviar email</Text>
          </Pressable>
          {error ? <Text style={{ color: "#ff7f7f", marginTop: 12 }}>{error}</Text> : null}
          <View style={{ marginTop: 16, alignItems: "center" }}>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={{ color: colors.textSecondary }}>Voltar para login</Text>
              </Pressable>
            </Link>
          </View>
        </AuthCard>
      </ScrollView>
    </SafeAreaView>
  );
}
