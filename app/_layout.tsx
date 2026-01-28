import { ThemeProvider } from "@/src/theme/ThemeProvider";
import * as Linking from "expo-linking";
import { Stack, router } from "expo-router";
import { onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { auth, db } from "@/src/config/firebase";

export default function RootLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     🔥 Firebase Auth 상태 리스너
     ========================= */
  useEffect(() => {
    console.log("🟡 RootLayout mounted");

    const unsub = onAuthStateChanged(auth, async (u) => {
      console.log("🟢 Auth state changed:", u?.uid ?? "null");

      setUser(u);
      setLoading(false);

      // 로그인 안 된 상태면 여기까지만
      if (!u) return;

      // 🔽 Firestore 유저 동기화 (실패해도 앱 막지 않음)
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
        console.error("⚠️ Firestore sync failed:", e);
      }
    });

    return unsub;
  }, []);

  /* =========================
     🟡 카카오 딥링크 로그인 처리
     verse72://login?token=XXXX
     ========================= */
  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      console.log("🟡 Deep link received:", url);

      const parsed = Linking.parse(url);
      const token = parsed.queryParams?.token;

      if (!token) return;

      try {
        console.log("🟡 Firebase custom token login start");

        await signInWithCustomToken(
          auth,
          decodeURIComponent(String(token))
        );

        console.log("🟢 Kakao Firebase login success");

        // 🔥 반드시 루트로 이동 → _layout 재평가
        router.replace("/");
      } catch (e) {
        console.error("🔥 Kakao Firebase login failed:", e);
      }
    };

    // 앱이 실행 중일 때 딥링크 수신
    const sub = Linking.addEventListener("url", handleDeepLink);

    // 앱이 꺼진 상태에서 딥링크로 실행된 경우
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => sub.remove();
  }, []);

  // 🔥 최초 Auth 판별 전에는 아무것도 렌더하지 않음
  if (loading) return null;

  return (
    <ThemeProvider>
      {/* 🔥 Stack은 절대 조건부로 렌더하면 안 됨 */}
      <Stack screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
    </ThemeProvider>
  );
}
