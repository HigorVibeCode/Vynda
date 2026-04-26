import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY_REMEMBER = "vynda_login_remember";
const KEY_EMAIL = "vynda_login_email";
const KEY_PASSWORD = "vynda_login_password";

export async function loadSavedLogin(): Promise<{
  remember: boolean;
  email: string;
  password: string;
}> {
  const remember = (await AsyncStorage.getItem(KEY_REMEMBER)) === "1";
  const email = (await AsyncStorage.getItem(KEY_EMAIL)) ?? "";
  let password = "";
  if (remember) {
    if (Platform.OS === "web") {
      password = (await AsyncStorage.getItem(KEY_PASSWORD)) ?? "";
    } else {
      try {
        password = (await SecureStore.getItemAsync(KEY_PASSWORD)) ?? "";
      } catch {
        password = "";
      }
    }
  }
  return { remember, email, password };
}

export async function saveLogin(email: string, password: string, remember: boolean): Promise<void> {
  if (remember) {
    await AsyncStorage.setItem(KEY_REMEMBER, "1");
    await AsyncStorage.setItem(KEY_EMAIL, email);
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(KEY_PASSWORD, password);
    } else {
      await SecureStore.setItemAsync(KEY_PASSWORD, password);
    }
  } else {
    await clearSavedLogin();
  }
}

export async function clearSavedLogin(): Promise<void> {
  await AsyncStorage.removeItem(KEY_REMEMBER);
  await AsyncStorage.removeItem(KEY_EMAIL);
  if (Platform.OS === "web") {
    await AsyncStorage.removeItem(KEY_PASSWORD);
  } else {
    try {
      await SecureStore.deleteItemAsync(KEY_PASSWORD);
    } catch {
      /* noop */
    }
  }
}
