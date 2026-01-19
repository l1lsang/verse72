import { auth, db } from "@/src/config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

/* ===============================
   타입
   =============================== */
export interface FirebaseMemorizedVerse {
  id: string;
  reference: string;
  text: string;
  updatedAt?: any;
}

/* ===============================
   단일 말씀 체크
   =============================== */
export async function checkMemorizedFromFirebase(
  verseId: string
): Promise<boolean> {
  if (!auth.currentUser) return false;

  const ref = doc(
    db,
    "users",
    auth.currentUser.uid,
    "memorized",
    verseId
  );

  const snap = await getDoc(ref);
  return snap.exists();
}

/* ===============================
   외웠어요 저장
   =============================== */
export async function saveMemorizedToFirebase({
  id,
  reference,
  text,
}: {
  id: string;
  reference: string;
  text: string;
}) {
  if (!auth.currentUser) throw new Error("로그인 필요");

  const ref = doc(
    db,
    "users",
    auth.currentUser.uid,
    "memorized",
    id
  );

  await setDoc(ref, {
    reference,
    text,
    updatedAt: serverTimestamp(),
  });
}

/* ===============================
   못 외웠어요 (삭제)
   =============================== */
export async function removeMemorizedFromFirebase(
  verseId: string
) {
  if (!auth.currentUser) return;

  const ref = doc(
    db,
    "users",
    auth.currentUser.uid,
    "memorized",
    verseId
  );

  await deleteDoc(ref);
}

/* ===============================
   ✅ 외운 말씀 전체 가져오기 (🔥 이게 핵심)
   =============================== */
export async function getMemorizedFromFirebase(): Promise<
  FirebaseMemorizedVerse[]
> {
  if (!auth.currentUser) return [];

  const colRef = collection(
    db,
    "users",
    auth.currentUser.uid,
    "memorized"
  );

  const snap = await getDocs(colRef);

  return snap.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<FirebaseMemorizedVerse, "id">),
    }))
    .sort(
      (a, b) =>
        (b.updatedAt?.seconds ?? 0) -
        (a.updatedAt?.seconds ?? 0)
    );
}
