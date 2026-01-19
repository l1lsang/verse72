import { useTheme } from "@/src/theme/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
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
  const { questions, answers } = useMemo(() => {
    try {
      return JSON.parse(params.data as string) as {
        questions: TestQuestion[];
        answers: string[];
      };
    } catch {
      return { questions: [], answers: [] };
    }
  }, [params.data]);

  /* =========================
     🧮 채점
     ========================= */
  const results = questions.map((q, i) => {
    const user = normalize(answers[i] || "");
    const correct = normalize(q.answers.join(" "));
    const isCorrect = user === correct;

    return {
      question: q,
      userAnswer: answers[i] || "",
      correctAnswer: q.answers.join(" "),
      isCorrect,
    };
  });

  const score = results.filter((r) => r.isCorrect).length;
  const total = questions.length;

  /* =========================
     💾 오답노트 저장 (한 번만)
     ========================= */
  useEffect(() => {
    if (questions.length > 0) {
      saveMemorizeRecord(questions, answers);
    }
  }, []);

  /* =========================
     🔁 다시 시험
     ========================= */
  const retry = () => {
    router.replace("/test");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 24 }}
    >
      {/* 점수 */}
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
      {results.map((r, idx) => {
        const { question } = r;

        return (
          <View
            key={question.id}
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
            {/* 상단 */}
            <Text
              style={{
                fontSize: 13,
                color: colors.subText,
                marginBottom: 4,
              }}
            >
              {idx + 1}. {question.verse.reference}
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.text,
                marginBottom: 12,
              }}
            >
              {question.prompt}
            </Text>

            {/* 사용자 답 */}
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

            {/* 정답 */}
            {!r.isCorrect && (
              <Text
                style={{
                  fontSize: 14,
                  color: colors.text,
                }}
              >
                정답: {r.correctAnswer}
              </Text>
            )}
          </View>
        );
      })}

      {/* 버튼 */}
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

      {/* 하단 여백 */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
