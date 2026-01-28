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
  const [chapterInput, setChapterInput] = useState("");
  const [verseInput, setVerseInput] = useState("");
  const [answers, setAnswers] = useState<any[]>([]);

  const current = questions[index];
  const isYedadam = current.mode === "YEDADAM";

  /* =========================
     ⏭ 다음 문제
     ========================= */
  const goNext = () => {
    if (isYedadam) {
      if (
        !chapterInput.trim() ||
        !verseInput.trim() ||
        !answer.trim()
      ) {
        Alert.alert(
          "입력 필요",
          "장, 절, 말씀을 모두 입력해 주세요."
        );
        return;
      }
    } else {
      if (!answer.trim()) {
        Alert.alert("입력 필요", "답을 입력해 주세요.");
        return;
      }
    }

    const nextAnswers = [...answers];
    nextAnswers[index] = isYedadam
      ? {
          chapter: chapterInput.trim(),
          verse: verseInput.trim(),
          text: answer.trim(),
        }
      : answer.trim();

    setAnswers(nextAnswers);
    setAnswer("");
    setChapterInput("");
    setVerseInput("");

    if (index + 1 < total) {
      setIndex(index + 1);
    } else {
      finishTest(nextAnswers);
    }
  };

  /* =========================
     🧮 시험 종료
     ========================= */
  const finishTest = (finalAnswers: any[]) => {
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
        {
          text: "나가기",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  };

  if (!current) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
        {/* 상단 */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: colors.subText }}>
            {index + 1} / {total}
          </Text>
          <Pressable onPress={confirmExit}>
            <Text style={{ color: colors.error }}>
              나가기
            </Text>
          </Pressable>
        </View>

        {/* 🔹 말씀 정보 섹션 라벨 (가려짐 해결 포인트) */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.subText,
            marginBottom: 8,
          }}
        >
          말씀 정보
        </Text>

        {/* 말씀 정보 카드 */}
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
          {/* 그룹 / 테마 */}
          <Text style={{ fontSize: 13, color: colors.subText }}>
            {current.verse.group} · {current.verse.theme}
          </Text>

          {/* 책 이름 */}
          <Text
            style={{
              marginTop: 4,
              fontSize: 15,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            {current.verse.book}
          </Text>

          {/* 두나미스만 장/절 표시 */}
          {!isYedadam && (
            <Text
              style={{
                marginTop: 2,
                fontSize: 14,
                color: colors.subText,
              }}
            >
              {current.verse.chapter}장{" "}
              {current.verse.verse}절
            </Text>
          )}
        </View>

        {/* 문제 */}
        <Text
          style={{
            fontSize: 18,
            lineHeight: 28,
            color: colors.text,
            marginBottom: 20,
          }}
        >
          {current.prompt}
        </Text>

        {/* 예닮공: 장 / 절 입력 */}
        {isYedadam && (
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <TextInput
              value={chapterInput}
              onChangeText={setChapterInput}
              placeholder="? 장"
              keyboardType="number-pad"
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                color: colors.text,
              }}
            />
            <TextInput
              value={verseInput}
              onChangeText={setVerseInput}
              placeholder="? 절 (예: 13 / 5~6)"
              style={{
                flex: 2,
                padding: 12,
                borderRadius: 12,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                color: colors.text,
              }}
            />
          </View>
        )}

        {/* 답 입력 */}
        <TextInput
          value={answer}
          onChangeText={setAnswer}
          placeholder={
            isYedadam
              ? "말씀을 끝까지 암송해보세요"
              : "정답을 입력하세요"
          }
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
            {index + 1 === total
              ? "제출하기"
              : "다음 문제"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
