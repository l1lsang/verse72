import { MemorizedProvider } from "@/src/context/MemorizedContext";
import { ThemeProvider } from "@/src/theme/ThemeProvider";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { Stack, router } from "expo-router";
import {
  onAuthStateChanged,
  signInWithCustomToken,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

import { auth, db } from "@/src/config/firebase";

export default function RootLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const updateCheckedRef = useRef(false);

  /* =========================
     🆕 업데이트 권고 체크 (1회)
     ========================= */
  useEffect(() => {
    const checkUpdate = async () => {
      if (updateCheckedRef.current) return;
      updateCheckedRef.current = true;

      try {
        const currentVersion =
          Constants.expoConfig?.version ?? "0.0.0";

        const ref = doc(db, "settings", "app");
        const snap = await getDoc(ref);

        if (!snap.exists()) return;

        const { latestVersion, updateMessage } = snap.data();

        if (
          latestVersion &&
          latestVersion !== currentVersion
        ) {
          Alert.alert(
            "업데이트 안내",
            updateMessage ??
              "새로운 버전이 있어요 🌱\n더 안정적으로 사용하실 수 있어요.",
            [
              {
                text: "업데이트",
                onPress: () =>
                  Linking.openURL(
                    "https://play.google.com/store/apps/details?id=com.quokka.dailybread"
                  ),
              },
              { text: "나중에", style: "cancel" },
            ]
          );
        }
      } catch (e) {
        console.log("⚠️ Update check failed:", e);
      }
    };

    checkUpdate();
  }, []);

  /* =========================
     🔥 Firebase Auth 상태 리스너
     ========================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);

      if (!u) return;

      try {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          await setDoc(ref, {
            uid: u.uid,
            provider:
              u.providerData[0]?.providerId ?? "unknown",
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
     ========================= */
  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      const parsed = Linking.parse(url);
      const token = parsed.queryParams?.token;
      const nickname = parsed.queryParams?.nickname;
      const photo = parsed.queryParams?.photo;

      if (!token) return;

      try {
        const cred = await signInWithCustomToken(
          auth,
          decodeURIComponent(String(token))
        );

        await updateProfile(cred.user, {
          displayName: nickname
            ? decodeURIComponent(String(nickname))
            : undefined,
          photoURL: photo
            ? decodeURIComponent(String(photo))
            : undefined,
        });

        router.replace("/");
      } catch (e) {
        console.error("🔥 Kakao Firebase login failed:", e);
      }
    };

    const sub = Linking.addEventListener(
      "url",
      handleDeepLink
    );

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => sub.remove();
  }, []);

  if (loading) return null;

  return (
<ThemeProvider>
  <MemorizedProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(ending)" />
    </Stack>
  </MemorizedProvider>
</ThemeProvider>


  );
}
