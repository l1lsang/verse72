import { auth, db } from "@/src/config/firebase";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

export async function syncUserToFirestore(extra?: {
  provider?: string;
  nickname?: string;
}) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  // ===============================
  // 🆕 최초 로그인 (회원가입)
  // ===============================
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email ?? null,
      provider: extra?.provider ?? "email",
      nickname:
        extra?.nickname ??
        user.displayName ??
        "사용자",
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
  }
  // ===============================
  // 🔁 재로그인
  // ===============================
  else {
    await updateDoc(ref, {
      lastLoginAt: serverTimestamp(),
    });
  }
}
