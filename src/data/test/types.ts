export type TestType = "DUNAMIS" | "YEDADAM";

export type TestQuestion = {
  id: string;
  mode: TestType;

  type:
    | "WORD_BLANK"
    | "TWO_PHRASE_REST"
    | "YEDADAM_HARDCORE";

  prompt: string;

  /* =========================
     🔥 사용자 입력값 (UI)
     ========================= */
  input?: {
    chapter?: string; // 예닮공: "? 장"
    verse?: string;   // 예닮공: "? 절 (6,7 / 37~39)"
    text?: string;    // 말씀 본문
  };

  /* =========================
     🧮 채점용 정답
     ========================= */
  answers: {
    chapter?: number; // 예닮공만 사용
    verse?: string;   // 예닮공만 사용
    text: string;     // 공통
  };

  verse: VerseData;
};

export type VerseData = {
  id: string;

  /* =========================
     📖 말씀 메타데이터
     ========================= */
  book: string;     // 예닮공에서도 "책 이름"은 노출
  group: string;    // A~F
  theme: string;    // 주제

  /* =========================
     🔢 장 / 절
     ========================= */
  chapter: number;  // 단일 값
  verse: string;    // "6,7" / "37~39"

  /* =========================
     📜 본문
     ========================= */
  text: string;
};
