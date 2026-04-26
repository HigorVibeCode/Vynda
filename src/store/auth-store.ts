import { Session } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import { create } from "zustand";

import { isSupabaseConfigured, supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

type AuthState = {
  session: Session | null;
  loading: boolean;
  error: string | null;
  clearAuthError: () => void;
  bootstrap: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string) => Promise<boolean>;
  recoverPassword: (email: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
};

let listenerBound = false;

function parseError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "Erro inesperado de autenticacao.";
}

function humanizeAuthError(error: unknown): string {
  const message = error && typeof error === "object" && "message" in error ? String((error as { message: string }).message) : "";
  const code = error && typeof error === "object" && "code" in error ? String((error as { code?: string }).code ?? "") : "";
  const lower = message.toLowerCase();

  if (
    lower.includes("rate limit") ||
    lower.includes("too many requests") ||
    code === "over_email_send_rate_limit" ||
    code === "too_many_requests"
  ) {
    return "Muitas tentativas em pouco tempo (limite do Supabase Auth). Aguarde cerca de 1 hora. No painel: Authentication > Rate Limits voce pode revisar os limites; em plano gratuito o limite e menor.";
  }
  if (code === "weak_password" || lower.includes("at least 6 characters")) {
    return "Senha muito fraca: o Supabase exige no minimo 6 caracteres. Use uma senha mais longa.";
  }
  if (code === "email_not_confirmed" || lower.includes("email not confirmed")) {
    return "Confirme seu email pelo link enviado antes de entrar.";
  }
  if (lower.includes("invalid login") || code === "invalid_credentials") {
    return "Email ou senha incorretos. Verifique ou use Recuperar senha.";
  }
  if (lower.includes("api key") || lower.includes("apikey") || lower.includes("invalid jwt")) {
    return "Problema de chave/URL do Supabase. No painel: Project Settings > API > copie a chave anon (comeca com eyJ), atualize EXPO_PUBLIC_SUPABASE_ANON_KEY e reinicie o app.";
  }
  if (message) {
    return message;
  }
  return parseError(error);
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,
  error: null,
  clearAuthError: () => set({ error: null }),
  bootstrap: async () => {
    if (!isSupabaseConfigured || !supabase) {
      set({ session: null, loading: false, error: null });
      return;
    }
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      set({ session: data.session, loading: false, error: null });
    } catch (error) {
      set({ error: parseError(error), loading: false });
    }

    if (!listenerBound) {
      listenerBound = true;
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, loading: false });
      });
    }
  },
  signInWithEmail: async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      set({ error: "Supabase nao configurado. Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY." });
      return false;
    }
    const cleanEmail = email.trim().toLowerCase();
    try {
      set({ error: null });
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error) {
        set({ error: humanizeAuthError(error), session: null, loading: false });
        return false;
      }
      if (!data.session) {
        set({
          error:
            "Nao foi possivel abrir a sessao. Se acabou de se cadastrar, confirme o email. Em Authentication > Providers, verifique a confirmacao de email.",
          session: null,
          loading: false,
        });
        return false;
      }
      set({ session: data.session, error: null, loading: false });
      return true;
    } catch (error) {
      set({ error: humanizeAuthError(error), session: null, loading: false });
      return false;
    }
  },
  signUpWithEmail: async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      set({ error: "Supabase nao configurado. Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY." });
      return false;
    }
    const cleanEmail = email.trim().toLowerCase();
    try {
      set({ error: null });
      const { error } = await supabase.auth.signUp({ email: cleanEmail, password });
      if (error) {
        set({ error: humanizeAuthError(error) });
        return false;
      }
      return true;
    } catch (error) {
      set({ error: humanizeAuthError(error) });
      return false;
    }
  },
  recoverPassword: async (email) => {
    if (!isSupabaseConfigured || !supabase) {
      set({ error: "Supabase nao configurado. Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY." });
      return false;
    }
    const cleanEmail = email.trim().toLowerCase();
    try {
      set({ error: null });
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
      if (error) {
        set({ error: humanizeAuthError(error) });
        return false;
      }
      return true;
    } catch (error) {
      set({ error: humanizeAuthError(error) });
      return false;
    }
  },
  signInWithGoogle: async () => {
    if (!isSupabaseConfigured || !supabase) {
      set({ error: "Supabase nao configurado. Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY." });
      return false;
    }
    try {
      set({ error: null });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "vynda://auth/callback",
        },
      });
      if (error) {
        throw error;
      }
      if (data.url) {
        await WebBrowser.openAuthSessionAsync(data.url, "vynda://auth/callback");
      }
      return true;
    } catch (error) {
      set({ error: humanizeAuthError(error) });
      return false;
    }
  },
  signOut: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    set({ session: null });
  },
}));
