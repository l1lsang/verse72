import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { getKeyHash, initializeKakaoSDK } from "@react-native-kakao/core";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Alert, InteractionManager } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      try {
        const appKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;

        if (!appKey || appKey.length < 10) {
          console.log("❌ Kakao appKey is invalid:", appKey);
          return;
        }

        // ✅ 1. 카카오 SDK 초기화
        initializeKakaoSDK({ appKey });
        console.log("✅ Kakao SDK initialized");

        // 🔥 2. [플랜 B] 키 해시 출력 (임시)
        const keyHash = await getKeyHash();
        console.log("🔥 Kakao KeyHash:", keyHash);
        Alert.alert("Kakao KeyHash", keyHash);
      } catch (e) {
        console.log("🔥 Kakao SDK init failed", e);
      }
    });
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
