import { MemorizedProvider } from "@/src/context/MemorizedContext";
import {
  ThemeProvider,
  useTheme,
} from "@/src/theme/ThemeProvider";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "@/src/config/firebase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

/* =========================
   🌱 바깥: Provider만 담당
   ========================= */
export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutInner />
    </ThemeProvider>
  );
}

/* =========================
   🌿 안쪽: useTheme 사용 가능
   ========================= */
function RootLayoutInner() {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const updateCheckedRef = useRef(false);

  /* 🔵 Google Sign-In 초기화 */
  useEffect(() => {
    const extra = Constants.expoConfig?.extra as any;

    GoogleSignin.configure({
      webClientId:
        extra?.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    });
  }, []);

  /* 🆕 업데이트 체크 */
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
              "새로운 버전이 있어요 🌱",
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

  /* 🔥 Firebase Auth */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setLoading(false);
      if (!u) return;

      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          uid: u.uid,
          provider:
            u.providerData[0]?.providerId ??
            "unknown",
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
    });

    return unsub;
  }, []);

  if (loading) return null;

  return (
    <MemorizedProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              paddingTop: 12,
              backgroundColor: colors.background,
            },
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(ending)" />
        </Stack>
      </SafeAreaView>
    </MemorizedProvider>
  );
}
