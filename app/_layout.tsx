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

      if (!u) return;

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
        console.error("⚠️ Firestore user sync failed:", e);
      }
    });

    return unsub;
  }, []);

  if (loading) return null;

  return (
    <ThemeProvider>
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
