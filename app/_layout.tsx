import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import { auth } from "@/src/config/firebase";

export default function RootLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  // 🔥 Auth 상태 확인 전에는 아무것도 렌더하지 않음
  if (loading) return null;

  return (
    <ThemeProvider>
      {user ? (
        <Stack
          key="tabs"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      ) : (
        <Stack
          key="auth"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="(auth)" />
        </Stack>
      )}
    </ThemeProvider>
  );
}
