/* =========================
   📦 암송 기록 & 오답노트 저장소
   (로컬 버전)
   ========================= */

import { TestQuestion } from "@/src/data/test/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* =========================
   🔑 Storage Keys
   ========================= */
const MEMORIZE_KEY = "VERSE72_MEMORIZE_RECORDS";

/* =========================
   📚 타입 정의
   ========================= */
export type MemorizeRecord = {
  id: string;                 // 시험 ID
  date: number;               // timestamp
  total: number;
  score: number;
  wrongs: WrongAnswer[];
};

export type WrongAnswer = {
  verseId: string;
  reference: string;
  prompt: string;
  correctAnswer: string;
  userAnswer: string;
};

/* =========================
   🧠 저장
   ========================= */
export async function saveMemorizeRecord(
  questions: TestQuestion[],
  userAnswers: string[]
) {
  const wrongs: WrongAnswer[] = [];

  questions.forEach((q, i) => {
    const correct = q.answers.join(" ").trim();
    const user = (userAnswers[i] || "").trim();

    if (normalize(correct) !== normalize(user)) {
      wrongs.push({
        verseId: q.verse.id,
        reference: q.verse.reference,
        prompt: q.prompt,
        correctAnswer: correct,
        userAnswer: user,
      });
    }
  });

  const record: MemorizeRecord = {
    id: `test_${Date.now()}`,
    date: Date.now(),
    total: questions.length,
    score: questions.length - wrongs.length,
    wrongs,
  };

  const prev = await getMemorizeRecords();
  const next = [record, ...prev];

  await AsyncStorage.setItem(MEMORIZE_KEY, JSON.stringify(next));
}

/* =========================
   📖 불러오기
   ========================= */
export async function getMemorizeRecords(): Promise<MemorizeRecord[]> {
  const raw = await AsyncStorage.getItem(MEMORIZE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/* =========================
   ❌ 전체 삭제 (초기화)
   ========================= */
export async function clearMemorizeRecords() {
  await AsyncStorage.removeItem(MEMORIZE_KEY);
}

/* =========================
   🔎 문자열 정규화
   ========================= */
function normalize(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:()"'“”‘’…]/g, "")
    .trim();
}
