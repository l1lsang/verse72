export type VerseData = {
  id: string;
  group: string;        // A / B / C …
  theme: string;        // 중심되신 그리스도
  reference: string;    // 고린도후서 5:17
  text: string;
};

export type TestType =
  | "WORD_BLANK"
  | "TWO_PHRASE_REST";

export type TestQuestion = {
  id: string;
  type: TestType;
  prompt: string;       // 빈칸 포함 문제
  answers: string[];    // 정답
  verse: VerseData;     // 원문 정보 (채점/표시용)
};
