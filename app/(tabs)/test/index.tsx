import { useTheme } from "@/src/theme/ThemeProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { adaptVerse72ToVerseData } from "@/src/data/test/adapter"; // 🔥 추가
import { generateTestByType } from "@/src/data/test/generator";
import { TestType } from "@/src/data/test/types";
import { verses72 } from "@/src/data/verses72";

type UITestType = "dunamis" | "yedadam";

export default function TestIndex() {
  const { colors } = useTheme();
  const router = useRouter();

  const [count, setCount] = useState<number>(5);
  const [testType, setTestType] =
    useState<UITestType>("dunamis");

  const startTest = () => {
    // 🔥 UI 타입 → 내부 시험 타입 변환
    const internalType: TestType =
      testType === "dunamis"
        ? "DUNAMIS"
        : "YEDADAM";

    // 🔥 Verse72 → VerseData 변환 (핵심)
    const versesForTest =
      adaptVerse72ToVerseData(verses72);

    const questions = generateTestByType(
      internalType,
      versesForTest,
      count
    );

    router.push({
      pathname: "/test/run",
      params: {
        data: JSON.stringify(questions),
        type: internalType,
      },
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 24 }}
    >
      {/* 제목 */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: colors.text,
        }}
      >
        모의고사
      </Text>

      <Text
        style={{
          marginTop: 8,
          color: colors.subText,
          lineHeight: 20,
        }}
      >
        말씀을 얼마나 정확히 암송하고 있는지 시험으로 확인해 보세요.
      </Text>

      {/* 시험 형식 선택 */}
      <View style={{ marginTop: 32 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
            marginBottom: 12,
          }}
        >
          시험 형식 선택
        </Text>

        {[
          { key: "dunamis", label: "대학 2부 두나미스" },
          { key: "yedadam", label: "대학 6부 예닮공" },
        ].map((item) => {
          const selected = testType === item.key;

          return (
            <Pressable
              key={item.key}
              onPress={() =>
                setTestType(item.key as UITestType)
              }
              style={{
                padding: 16,
                borderRadius: 14,
                marginBottom: 12,
                backgroundColor: selected
                  ? colors.primary
                  : colors.card,
                borderWidth: selected ? 0 : 1,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: selected ? "700" : "500",
                  color: selected ? "#fff" : colors.text,
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 문제 수 선택 */}
      <View style={{ marginTop: 32 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
            marginBottom: 12,
          }}
        >
          문제 수 선택
        </Text>

        {[5, 10, 20].map((n) => {
          const selected = count === n;

          return (
            <Pressable
              key={n}
              onPress={() => setCount(n)}
              style={{
                padding: 16,
                borderRadius: 14,
                marginBottom: 12,
                backgroundColor: selected
                  ? colors.primary
                  : colors.card,
                borderWidth: selected ? 0 : 1,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: selected ? "700" : "500",
                  color: selected ? "#fff" : colors.text,
                }}
              >
                {n} 문제
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 시험 시작 버튼 */}
      <Pressable
        onPress={startTest}
        style={{
          marginTop: 40,
          paddingVertical: 18,
          borderRadius: 16,
          backgroundColor: colors.primary,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            color: "#fff",
          }}
        >
          시험 시작
        </Text>
      </Pressable>

      {/* 안내 문구 */}
      <Text
        style={{
          marginTop: 24,
          fontSize: 13,
          color: colors.subText,
          lineHeight: 18,
        }}
      >
        · 문제는 무작위로 출제됩니다.{"\n"}
        · 시험 형식에 따라 난이도가 다릅니다.{"\n"}
        · 시험 중에는 뒤로 가기 시 진행 상황이 사라질 수 있습니다.
      </Text>
    </ScrollView>
  );
}
