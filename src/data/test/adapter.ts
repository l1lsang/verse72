import { Verse72 } from "@/src/data/verses72";
import { parseReference } from "./referenceParser";
import { VerseData } from "./types";

export function adaptVerse72ToVerseData(
  verses: Verse72[]
): VerseData[] {
  return verses.map((v) => {
    try {
      const { book, chapter, verse } =
        parseReference(v.reference);

      return {
        id: v.id,

        // 🔥 말씀 메타데이터
        book: book.trim(),
        group: v.group,   // ✅ 추가
        theme: v.theme,   // ✅ 추가

        // 🔢 장 / 절
        chapter,
        verse: verse.trim(), // "6,7" / "37~39"

        // 📜 본문
        text: v.text.trim(),
      };
    } catch (e) {
      console.error(
        "❌ Reference parse failed:",
        v.reference,
        e
      );

      // 🔥 앱이 절대 터지지 않게 fallback
      return {
        id: v.id,

        // 메타데이터는 최대한 살려둠
        book: "",
        group: v.group,
        theme: v.theme,

        chapter: 0,
        verse: "",
        text: v.text.trim(),
      };
    }
  });
}
