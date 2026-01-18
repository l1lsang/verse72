import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { getKeyHash, initializeKakaoSDK } from "@react-native-kakao/core";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    initializeKakaoSDK({
      appKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY!,
    });

    // 🔥 플랜 B: 키 해시 직접 출력
    getKeyHash().then((hash) => {
      console.log("🔥 Kakao KeyHash:", hash);
      Alert.alert("Kakao KeyHash", hash);
    });
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}

