import { Link, Redirect } from "expo-router";

import { bypassAuth } from "../../src/lib/bypass-auth";
import { useEffect, useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, Switch, Text, View } from "react-native";

import { AuthCard } from "../../src/components/AuthCard";
import { AuthFormFields } from "../../src/components/AuthFormFields";
import { clearSavedLogin, loadSavedLogin, saveLogin } from "../../src/lib/saved-login";
import { isSupabaseConfigured } from "../../src/lib/supabase";
import { useAuthStore } from "../../src/store/auth-store";
import { colors } from "../../src/theme/colors";

export default function LoginScreen() {
  const { session, signInWithEmail, signInWithGoogle, error, clearAuthError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRevealed, setPasswordRevealed] = useState(false);
  const [savePassword, setSavePassword] = useState(false);
  const [credentialsReady, setCredentialsReady] = useState(false);

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  useEffect(() => {
    let active = true;
    loadSavedLogin()
      .then((saved) => {
        if (!active) {
          return;
        }
        setSavePassword(saved.remember);
        if (saved.remember) {
          setEmail(saved.email);
          setPassword(saved.password);
        }
        setCredentialsReady(true);
      })
      .catch(() => setCredentialsReady(true));
    return () => {
      active = false;
    };
  }, []);

  if (bypassAuth) {
    return <Redirect href="/(app)" />;
  }

  if (session) {
    return <Redirect href="/(app)" />;
  }

  async function handleEmailLogin() {
    if (!isSupabaseConfigured) {
      Alert.alert("Configurar Supabase", "Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }
    const ok = await signInWithEmail(email.trim().toLowerCase(), password);
    if (ok) {
      await saveLogin(email.trim().toLowerCase(), password, savePassword);
    } else {
      const msg = useAuthStore.getState().error;
      Alert.alert("Falha no login", msg || "Nao foi possivel entrar. Tente de novo.");
    }
  }

  async function handleGoogleLogin() {
    if (!isSupabaseConfigured) {
      Alert.alert("Configurar Supabase", "Defina as variaveis de ambiente do Supabase.");
      return;
    }
    await signInWithGoogle();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <AuthCard title="Vynda" subtitle="Seu cerebro de desenvolvimento pessoal.">
          <AuthFormFields
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            passwordRevealed={passwordRevealed}
            onPasswordRevealChange={setPasswordRevealed}
          />
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: colors.textSecondary, flex: 1, paddingRight: 8 }}>Salvar senha neste aparelho</Text>
            <Switch
              value={savePassword}
              onValueChange={(value) => {
                setSavePassword(value);
                if (!value) {
                  void clearSavedLogin();
                }
              }}
              trackColor={{ false: "#3A3A44", true: colors.primary }}
              disabled={!credentialsReady}
            />
          </View>
          <View style={{ gap: 10, marginTop: 16 }}>
            <Pressable
              onPress={handleEmailLogin}
              style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12 }}
            >
              <Text style={{ color: colors.textPrimary, textAlign: "center", fontWeight: "700" }}>Entrar</Text>
            </Pressable>
            <Pressable
              onPress={handleGoogleLogin}
              style={{ backgroundColor: "#2A2A35", borderRadius: 12, paddingVertical: 12 }}
            >
              <Text style={{ color: colors.textPrimary, textAlign: "center", fontWeight: "600" }}>
                Entrar com Google
              </Text>
            </Pressable>
          </View>
          {error ? <Text style={{ color: "#ff7f7f", marginTop: 12 }}>{error}</Text> : null}
          <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "space-between" }}>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text style={{ color: colors.textSecondary }}>Criar conta</Text>
              </Pressable>
            </Link>
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable>
                <Text style={{ color: colors.textSecondary }}>Recuperar senha</Text>
              </Pressable>
            </Link>
          </View>
        </AuthCard>
      </ScrollView>
    </SafeAreaView>
  );
}
