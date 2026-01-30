import { auth, db } from "@/src/config/firebase";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

/* ===============================
   타입 (Firebase에는 상태 스냅샷만 저장)
   =============================== */
export interface FirebaseMemorizedState {
  ids: string[];        // 외운 verse id 전체
  updatedAt: any;
}

/* ===============================
   🔥 전체 암송 상태 저장 (덮어쓰기)
   =============================== */
export async function saveMemorizedSetToFirebase(
  ids: Set<string>
) {
  if (!auth.currentUser) return;

  const ref = doc(
    db,
    "users",
    auth.currentUser.uid,
    "state",
    "memorized"
  );

  await setDoc(ref, {
    ids: Array.from(ids),
    updatedAt: serverTimestamp(),
  });
}

/* ===============================
   🔥 전체 암송 상태 불러오기
   =============================== */
export async function getMemorizedSetFromFirebase(): Promise<
  Set<string>
> {
  if (!auth.currentUser) return new Set();

  const ref = doc(
    db,
    "users",
    auth.currentUser.uid,
    "state",
    "memorized"
  );

  const snap = await getDoc(ref);
  if (!snap.exists()) return new Set();

  const data = snap.data() as FirebaseMemorizedState;
  return new Set(data.ids || []);
}
