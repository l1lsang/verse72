import { useTheme } from "@/src/theme/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import { TestQuestion } from "@/src/data/test/types";

export default function TestRun() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  /* =========================
     📦 문제 데이터 파싱
     ========================= */
  const questions: TestQuestion[] = useMemo(() => {
    try {
      return JSON.parse(params.data as string);
    } catch {
      return [];
    }
  }, [params.data]);

  const total = questions.length;

  /* =========================
     🔢 상태
     ========================= */
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);

  const current = questions[index];

  /* =========================
     ⏭ 다음 문제
     ========================= */
  const goNext = () => {
    if (!answer.trim()) {
      Alert.alert("입력 필요", "답을 입력해 주세요.");
      return;
    }

    const nextAnswers = [...answers];
    nextAnswers[index] = answer.trim();
    setAnswers(nextAnswers);
    setAnswer("");

    if (index + 1 < total) {
      setIndex(index + 1);
    } else {
      finishTest(nextAnswers);
    }
  };

  /* =========================
     🧮 시험 종료
     ========================= */
  const finishTest = (finalAnswers: string[]) => {
    router.replace({
      pathname: "/test/result",
      params: {
        data: JSON.stringify({
          questions,
          answers: finalAnswers,
        }),
      },
    });
  };

  /* =========================
     🔙 나가기 확인
     ========================= */
  const confirmExit = () => {
    Alert.alert(
      "시험 종료",
      "시험을 중단하면 진행 상황이 사라집니다.\n정말 나가시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { text: "나가기", style: "destructive", onPress: () => router.back() },
      ]
    );
  };

  if (!current) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>문제를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, padding: 24 }}>
        {/* 상단 정보 */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <Text style={{ color: colors.subText }}>
            {index + 1} / {total}
          </Text>

          <Pressable onPress={confirmExit}>
            <Text style={{ color: colors.error }}>나가기</Text>
          </Pressable>
        </View>

        {/* 말씀 정보 */}
        <View
          style={{
            padding: 16,
            borderRadius: 14,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 13, color: colors.subText }}>
            {current.verse.group} · {current.verse.theme}
          </Text>
          <Text
            style={{
              marginTop: 4,
              fontSize: 14,
              fontWeight: "600",
              color: colors.text,
            }}
          >
            {current.verse.reference}
          </Text>
        </View>

        {/* 문제 */}
        <Text
          style={{
            fontSize: 18,
            lineHeight: 28,
            color: colors.text,
            marginBottom: 24,
          }}
        >
          {current.prompt}
        </Text>

        {/* 입력 */}
        <TextInput
          value={answer}
          onChangeText={setAnswer}
          placeholder="정답을 입력하세요"
          placeholderTextColor={colors.subText}
          multiline
          style={{
            minHeight: 90,
            padding: 16,
            borderRadius: 14,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            color: colors.text,
            textAlignVertical: "top",
          }}
        />

        {/* 버튼 */}
        <Pressable
          onPress={goNext}
          style={{
            marginTop: 28,
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
            {index + 1 === total ? "제출하기" : "다음 문제"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
