import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { auth, db } from "@/src/config/firebase";

export default function RootLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);

      // 🔥 핵심: Auth만 성공하면 앱 진입 허용
      if (!u) return;

      // 🔽 Firestore는 "보조 작업" (실패해도 앱 막지 않음)
      try {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          await setDoc(ref, {
            uid: u.uid,
            provider: u.providerData[0]?.providerId ?? "unknown",
            email: u.email ?? null,
            displayName: u.displayName ?? null,
            photoURL: u.photoURL ?? null,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          });
        } else {
          await setDoc(
            ref,
            { lastLoginAt: serverTimestamp() },
            { merge: true }
          );
        }
      } catch (e) {
        // ❗ 절대 throw 하지 말 것
        console.error("⚠️ Firestore user sync failed:", e);
      }
    });

    return unsub;
  }, []);

  // 🔥 Auth 상태 확인 전에는 아무것도 렌더하지 않음
  if (loading) return null;

  return (
    <ThemeProvider>
      {user ? (
        <Stack key="tabs" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      ) : (
        <Stack key="auth" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
        </Stack>
      )}
    </ThemeProvider>
  );
}
