import { auth, db } from "@/src/config/firebase";
import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

/* ============================
   타입 정의
============================ */

export type FirebaseMemorizedVerse = {
  id: string;
  reference: string;
  text: string;
  memorizedAt: any;
};

/* ============================
   ✅ 암송 기록 저장
============================ */

export async function saveMemorizedToFirebase(verse: {
  id: string;
  reference: string;
  text: string;
}) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const ref = doc(
    db,
    "users",
    user.uid,
    "memorized",
    verse.id
  );

  await setDoc(
    ref,
    {
      reference: verse.reference,
      text: verse.text,
      memorizedAt: serverTimestamp(),
    },
    { merge: true } // 🔥 동일 verseId 재저장 시 덮어쓰기
  );
}

/* ============================
   📥 암송 기록 불러오기
============================ */

export async function getMemorizedFromFirebase(): Promise<
  FirebaseMemorizedVerse[]
> {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "users", user.uid, "memorized"),
    orderBy("memorizedAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as any),
  }));
}
