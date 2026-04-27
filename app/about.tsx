import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Sobre", headerShown: true }} />
      <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
        <Text className="text-center text-lg text-slate-800">
          Esta tela confirma o Expo Router.
        </Text>
        <Link href="/" asChild>
          <Text className="text-base font-semibold text-indigo-600">
            Voltar ao início
          </Text>
        </Link>
      </View>
    </>
  );
}
