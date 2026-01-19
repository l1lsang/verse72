import { TestQuestion, VerseData } from "./types";

/* =========================
   🔧 유틸
   ========================= */
const shuffle = <T,>(arr: T[]) =>
  [...arr].sort(() => Math.random() - 0.5);

const STOP_WORDS = new Set([
  "은", "는", "이", "가", "을", "를", "에", "의",
  "와", "과", "도", "로", "으로",
  "그", "저", "내", "네", "우리", "너희",
]);

const tokenize = (text: string) =>
  text.split(/\s+/).filter(Boolean);

/* =========================
   🅰 단어 빈칸
   ========================= */
function makeWordBlank(v: VerseData): TestQuestion {
  const tokens = tokenize(v.text);

  const candidates = tokens.filter(
    t => t.length > 1 && !STOP_WORDS.has(t)
  );

  const answer = shuffle(candidates)[0];

  const prompt = v.text.replace(answer, "____");

  return {
    id: `q_${v.id}_word`,
    type: "WORD_BLANK",
    prompt,
    answers: [answer],
    verse: v,
  };
}

/* =========================
   🅱 앞 두 어절 + 나머지 빈칸
   ========================= */
function makeTwoPhraseRest(v: VerseData): TestQuestion {
  const tokens = tokenize(v.text);

  const head = tokens.slice(0, 2).join(" ");
  const rest = tokens.slice(2).join(" ");

  return {
    id: `q_${v.id}_two`,
    type: "TWO_PHRASE_REST",
    prompt: `${head} ____`,
    answers: [rest],
    verse: v,
  };
}

/* =========================
   🎯 시험 생성 (유형 랜덤 섞기)
   ========================= */
export function generateTest(
  verses: VerseData[],
  count: number
): TestQuestion[] {
  return shuffle(verses)
    .slice(0, count)
    .map(v =>
      Math.random() < 0.5
        ? makeWordBlank(v)
        : makeTwoPhraseRest(v)
    );
}
