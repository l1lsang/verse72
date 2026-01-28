type ParsedReference = {
  book: string;
  chapter: number;
  verse: string;
};

/**
 * "로마서 12:1"
 * "빌립보서 4:6,7"
 * "마태복음 22:37~39"
 * → 절은 문자열 그대로 유지
 */
export function parseReference(
  reference: string
): ParsedReference {
  // 예: ["로마서", "12:1"]
  const [book, rest] = reference.split(" ");

  if (!rest) {
    throw new Error(
      `Invalid reference format: ${reference}`
    );
  }

  // rest: "12:1", "4:6,7", "22:37~39"
  const [chapterStr, verseStr] = rest.split(":");

  const chapter = Number(chapterStr);

  if (Number.isNaN(chapter) || !verseStr) {
    throw new Error(
      `Invalid reference format: ${reference}`
    );
  }

  // 🔥 절은 그대로 사용 ("6,7", "37~39")
  const verse = verseStr.trim();

  return { book, chapter, verse };
}
