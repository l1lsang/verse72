import { useTheme } from "@/src/theme/ThemeProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { generateTest } from "@/src/data/test/generator";
import { verses72 } from "@/src/data/verses72";

export default function TestIndex() {
  const { colors } = useTheme();
  const router = useRouter();

  const [count, setCount] = useState<number>(5);

  const startTest = () => {
    const questions = generateTest(verses72, count);

    router.push({
      pathname: "/test/run",
      params: {
        data: JSON.stringify(questions),
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
        모의 고사
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
        · 단어 빈칸 / 문장 빈칸 유형이 섞여 나옵니다.{"\n"}
        · 시험 중에는 뒤로 가기 시 진행 상황이 사라질 수 있습니다.
      </Text>
    </ScrollView>
  );
}
