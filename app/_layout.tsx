import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { InteractionManager } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      try {
        const appKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;

        if (!appKey || appKey.length < 10) {
          console.log("❌ Kakao appKey is invalid:", appKey);
          return;
        }

        initializeKakaoSDK({ appKey });
        console.log("✅ Kakao SDK initialized");
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
