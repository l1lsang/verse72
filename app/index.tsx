import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import { auth } from "@/src/config/firebase";

export default function Index() {
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return unsub;
  }, []);

  // 🔥 Auth 상태 확인 전에는 아무것도 렌더하지 않음
  if (user === undefined) return null;

  // 🔥 로그인 여부에 따라 라우팅
  return user ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
