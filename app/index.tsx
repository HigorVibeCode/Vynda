import { supabase } from "../lib/supabase";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function HomeScreen() {
  const hasConfig = Boolean(
    process.env.EXPO_PUBLIC_SUPABASE_URL &&
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  );

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-white px-6">
      <StatusBar style="dark" />
      <Animated.View entering={FadeInDown.duration(600).springify()}>
        <Text className="text-center text-3xl font-bold text-slate-900">
          Vynda
        </Text>
        <Text className="mt-2 text-center text-base text-slate-600">
          Expo Router · NativeWind · Reanimated · Supabase · Secure Store
        </Text>
      </Animated.View>
      <View className="w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Text className="text-center text-sm font-medium text-slate-800">
          Supabase
        </Text>
        <Text className="mt-1 text-center text-xs text-slate-500">
          {hasConfig
            ? "Variáveis EXPO_PUBLIC_SUPABASE_* carregadas."
            : "Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no arquivo .env."}
        </Text>
        <Text className="mt-2 text-center text-xs text-slate-400">
          Cliente Supabase inicializado com armazenamento seguro.
        </Text>
      </View>
      <Link href="/about" asChild>
        <Text className="text-base font-semibold text-indigo-600">
          Ir para exemplo de rota
        </Text>
      </Link>
    </View>
  );
}
