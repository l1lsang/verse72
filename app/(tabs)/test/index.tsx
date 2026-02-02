import { useTheme } from "@/src/theme/ThemeProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { adaptVerse72ToVerseData } from "@/src/data/test/adapter";
import { generateTestByType } from "@/src/data/test/generator";
import { TestType } from "@/src/data/test/types";
import { verses72 } from "@/src/data/verses72";

type UITestType = "dunamis" | "yedadam";
type VerseGroup = "A" | "B" | "C" | "D" | "E" | "F";

const ALL_GROUPS: VerseGroup[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
];

export default function TestIndex() {
  const { colors } = useTheme();
  const router = useRouter();

  /* ================= 상태 ================= */
  const [count, setCount] = useState<number>(5);
  const [customCount, setCustomCount] = useState<string>("");

  const [testType, setTestType] =
    useState<UITestType>("dunamis");

  // 🔥 시험 범위 (A~F, 복수 선택)
  const [groups, setGroups] = useState<VerseGroup[]>([
    "A",
  ]);

  const toggleGroup = (group: VerseGroup) => {
    setGroups((prev) =>
      prev.includes(group)
        ? prev.filter((g) => g !== group)
        : [...prev, group]
    );
  };

  /* ================= 시험 시작 ================= */
  const startTest = () => {
    if (groups.length === 0) {
      Alert.alert(
        "시험 범위 선택",
        "시험 범위를 하나 이상 선택해주세요."
      );
      return;
    }

    if (count <= 0) {
      Alert.alert(
        "문제 수 오류",
        "문제 수는 1문제 이상이어야 합니다."
      );
      return;
    }

    if (count > 50) {
      Alert.alert(
        "문제 수 제한",
        "최대 50문제까지 출제할 수 있습니다."
      );
      return;
    }

    // 🔥 UI 타입 → 내부 시험 타입
    const internalType: TestType =
      testType === "dunamis"
        ? "DUNAMIS"
        : "YEDADAM";

    // 🔥 group(A~F) 기준 필터링
    const filteredVerses = verses72.filter((v) =>
      groups.includes(v.group as VerseGroup)
    );

    const versesForTest =
      adaptVerse72ToVerseData(filteredVerses);

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
        groups: groups.join(","),
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
        말씀을 얼마나 정확히 암송하고 있는지
        시험으로 확인해 보세요.
      </Text>

      {/* ================= 시험 형식 ================= */}
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

      {/* ================= 시험 범위 ================= */}
      <View style={{ marginTop: 32 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
            marginBottom: 12,
          }}
        >
          시험 범위 선택 (복수 선택 가능)
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {ALL_GROUPS.map((group) => {
            const selected = groups.includes(group);

            return (
              <Pressable
                key={group}
                onPress={() => toggleGroup(group)}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 18,
                  borderRadius: 999,
                  backgroundColor: selected
                    ? colors.primary
                    : colors.card,
                  borderWidth: selected ? 0 : 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: selected
                      ? "700"
                      : "500",
                    color: selected
                      ? "#fff"
                      : colors.text,
                  }}
                >
                  {group} 파트
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ================= 문제 수 ================= */}
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

        {/* 🔘 프리셋 (라디오) */}
        {[5, 10, 20].map((n) => {
          const selected =
            customCount === "" && count === n;

          return (
            <Pressable
              key={n}
              onPress={() => {
                setCount(n);
                setCustomCount("");
              }}
              style={{
                padding: 16,
                borderRadius: 14,
                marginBottom: 12,
                backgroundColor: selected
                  ? colors.primary
                  : colors.card,
                borderWidth: selected ? 0 : 1,
                borderColor: colors.border,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  borderWidth: 2,
                  borderColor: selected
                    ? "#fff"
                    : colors.subText,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selected && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#fff",
                    }}
                  />
                )}
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: selected
                    ? "700"
                    : "500",
                  color: selected
                    ? "#fff"
                    : colors.text,
                }}
              >
                {n} 문제
              </Text>
            </Pressable>
          );
        })}

        {/* ✏️ 직접 입력 */}
        <View
          style={{
            marginTop: 8,
            padding: 16,
            borderRadius: 14,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: colors.subText,
              marginBottom: 6,
            }}
          >
            직접 입력
          </Text>

          <TextInput
            value={customCount}
            onChangeText={(text) => {
              const onlyNumber =
                text.replace(/[^0-9]/g, "");
              setCustomCount(onlyNumber);

              const n = Number(onlyNumber);
              if (n > 0) {
                setCount(n);
              }
            }}
            keyboardType="number-pad"
            placeholder="예: 7"
            placeholderTextColor={colors.subText}
            style={{
              fontSize: 16,
              paddingVertical: 8,
              color: colors.text,
            }}
          />
        </View>
      </View>

      {/* ================= 시험 시작 ================= */}
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

      {/* 안내 */}
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
        · 시험 중 뒤로 가기 시 진행 상황이
        사라질 수 있습니다.
      </Text>
    </ScrollView>
  );
}
