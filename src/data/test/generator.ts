import { TestQuestion, TestType, VerseData } from "./types";

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
   🅰 두나미스: 단어 빈칸
   ========================= */
function makeWordBlank(v: VerseData): TestQuestion {
  const tokens = tokenize(v.text);

  const candidates = tokens.filter(
    (t) => t.length > 1 && !STOP_WORDS.has(t)
  );

  // ✅ 빈칸 개수: 4~5개 랜덤
  const blankCount = Math.min(
    candidates.length,
    Math.random() < 0.5 ? 4 : 5
  );

  // ✅ 빈칸으로 만들 단어 선택
  const answers = shuffle(candidates).slice(0, blankCount);

  // ✅ 각 단어를 개별 빈칸으로 치환
  let prompt = v.text;
  answers.forEach((word) => {
    prompt = prompt.replace(word, "____");
  });

  return {
    id: `q_${v.id}_word`,
    mode: "DUNAMIS",
    type: "WORD_BLANK",

    prompt,

    // 🔥 여러 개 정답
    answers: {
      texts: answers, // ["하나님은", "우리의", "피난처요", ...]
    },

    verse: v,
  };
}


/* =========================
   🅱 두나미스: 앞 두 어절 제공
   ========================= */
function makeTwoPhraseRest(v: VerseData): TestQuestion {
  const tokens = tokenize(v.text);

  const head = tokens.slice(0, 2).join(" ");
  const rest = tokens.slice(2).join(" ");

  return {
    id: `q_${v.id}_two`,
    mode: "DUNAMIS",
    type: "TWO_PHRASE_REST",
    prompt: `${head} _____________________`,
    answers: { text: rest },
    verse: v,
  };
}

/* =========================
   🔥 예닮공: 단일 큰 빈칸
   ========================= */
function makeSingleBigBlank() {
  return "____________________________";
}

/* =========================
   🌱 예닮공: 하드코어 암송
   - 책 이름 ❌
   - 장 / 절 입력 필수
   - 말씀 전체 직접 입력
   ========================= */
function makeYedadamHardcore(
  v: VerseData
): TestQuestion {
  return {
    id: `q_${v.id}_yedadam`,
    mode: "YEDADAM",
    type: "YEDADAM_HARDCORE",

    // ✅ 문제: 단일 빈칸 하나
    prompt: makeSingleBigBlank(),

    // 🔥 UI에서 직접 입력
    input: {
      chapter: "",
      verse: "",
      text: "",
    },

    // 🔒 채점용 정답 (UI 비노출)
    answers: {
      chapter: v.chapter,
      verse: v.verse,
      text: v.text,
    },

    verse: v,
  };
}

/* =========================
   🎯 시험 생성 (형식별)
   ========================= */
export function generateTestByType(
  type: TestType,
  verses: VerseData[],
  count: number
): TestQuestion[] {
  const picked = shuffle(verses).slice(0, count);

  switch (type) {
    case "DUNAMIS":
      return picked.map((v) =>
        Math.random() < 0.5
          ? makeWordBlank(v)
          : makeTwoPhraseRest(v)
      );

    case "YEDADAM":
      return picked.map((v) =>
        makeYedadamHardcore(v)
      );

    default:
      return [];
  }
}
