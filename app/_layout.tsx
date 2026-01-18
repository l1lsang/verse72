import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    initializeKakaoSDK({
      appKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY!,
    });
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
