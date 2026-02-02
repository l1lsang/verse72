import { useTheme } from "@/src/theme/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { TestQuestion } from "@/src/data/test/types";
import { saveMemorizeRecord } from "@/src/storage/memorize";

/* =========================
   🔎 정답 비교 (관대한 채점)
   ========================= */
function normalize(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:()"'“”‘’…]/g, "")
    .trim();
}

export default function TestResult() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  /* =========================
     📦 데이터 파싱
     ========================= */
  const parsed = useMemo(() => {
    if (typeof params.data !== "string") return null;

    try {
      return JSON.parse(params.data) as {
        questions: TestQuestion[];
        answers: any[]; // 🔥 단일 string | string[]
      };
    } catch (e) {
      console.warn("❌ TestResult JSON parse failed", e);
      return null;
    }
  }, [params.data]);

  const questions = parsed?.questions ?? [];
  const answers = parsed?.answers ?? [];

  /* =========================
     🧮 채점 로직
     ========================= */
  const results = useMemo(() => {
    return questions.map((q, i) => {
      const userRaw = answers[i];

      /* =========================
         🅰 WORD_BLANK (다중 단어)
         ========================= */
      if (q.type === "WORD_BLANK") {
        const correctTexts = q.answers.texts ?? [];
        const userTexts = Array.isArray(userRaw)
          ? userRaw
          : [];

        const normalizedUser = userTexts.map(normalize);
        const normalizedCorrect = correctTexts.map(normalize);

        const correctCount = normalizedCorrect.filter((c) =>
          normalizedUser.includes(c)
        ).length;

        const isCorrect =
          correctCount === normalizedCorrect.length;

        return {
          question: q,
          userAnswer: userTexts.join(", "),
          correctAnswer: correctTexts.join(", "),
          isCorrect,
          partial:
            `${correctCount} / ${normalizedCorrect.length}`,
        };
      }

      /* =========================
         🅱 나머지 (단일 정답)
         ========================= */
      const user = normalize(String(userRaw || ""));
      const correct = normalize(q.answers.text ?? "");
      const isCorrect = user === correct;

      return {
        question: q,
        userAnswer: String(userRaw || ""),
        correctAnswer: q.answers.text ?? "",
        isCorrect,
      };
    });
  }, [questions, answers]);

  const score = results.filter((r) => r.isCorrect).length;
  const total = questions.length;

  /* =========================
     💾 오답노트 저장 (1회)
     ========================= */
  const savedRef = useRef(false);

  useEffect(() => {
    if (
      !savedRef.current &&
      questions.length > 0 &&
      answers.length > 0
    ) {
      saveMemorizeRecord(questions, answers);
      savedRef.current = true;
    }
  }, [questions, answers]);

  /* =========================
     🔁 다시 시험
     ========================= */
  const retry = () => {
    router.replace("/test");
  };

  /* =========================
     🚨 방어 UI
     ========================= */
  if (!parsed) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text style={{ color: colors.subText, marginBottom: 16 }}>
          시험 결과를 불러올 수 없어요 😢
        </Text>

        <Pressable
          onPress={retry}
          style={{
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 14,
            backgroundColor: colors.primary,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            다시 시험 보기
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 24 }}
    >
      {/* 점수 요약 */}
      <View
        style={{
          padding: 20,
          borderRadius: 18,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 28,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "800",
            color: colors.text,
          }}
        >
          시험 결과
        </Text>

        <Text
          style={{
            marginTop: 12,
            fontSize: 18,
            color: colors.primary,
            fontWeight: "700",
          }}
        >
          {score} / {total} 정답
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 14,
            color: colors.subText,
          }}
        >
          {total > 0
            ? Math.round((score / total) * 100)
            : 0}
          % 달성
        </Text>
      </View>

      {/* 문제별 결과 */}
      {results.map((r: any, idx) => (
        <View
          key={r.question.id}
          style={{
            marginBottom: 24,
            padding: 16,
            borderRadius: 14,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: r.isCorrect
              ? colors.primary
              : colors.error,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: colors.subText,
              marginBottom: 4,
            }}
          >
            {idx + 1}. {r.question.verse.group}
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.text,
              marginBottom: 12,
            }}
          >
            {r.question.prompt}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: r.isCorrect
                ? colors.primary
                : colors.error,
              marginBottom: 6,
            }}
          >
            내 답: {r.userAnswer || "(미입력)"}
          </Text>

          {!r.isCorrect && (
            <>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.text,
                }}
              >
                정답: {r.correctAnswer}
              </Text>

              {"partial" in r && (
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    color: colors.subText,
                  }}
                >
                  맞힌 개수: {r.partial}
                </Text>
              )}
            </>
          )}
        </View>
      ))}

      <Pressable
        onPress={retry}
        style={{
          marginTop: 12,
          paddingVertical: 16,
          borderRadius: 16,
          backgroundColor: colors.primary,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#fff",
          }}
        >
          다시 시험 보기
        </Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
