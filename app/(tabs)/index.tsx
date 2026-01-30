import { useMemo } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useMemorized } from "@/src/context/MemorizedContext";
import { verses72 } from "@/src/data/verses72";
import { useTheme } from "@/src/theme/ThemeProvider";

const TOTAL_VERSES = 72;

export default function HomeScreen() {
  const { colors } = useTheme();
  const { memorized, toggle } = useMemorized();

  /* =========================
     📊 전체 개수
     ========================= */
  const count = memorized.size;

  /* =========================
     🕊 최근 외운 말씀
     ========================= */
  const recent = useMemo(() => {
    const ids = Array.from(memorized);
    const lastId = ids[ids.length - 1];
    return verses72.find((v) => v.id === lastId) ?? null;
  }, [memorized]);

  const progressPercent = Math.min(
    (count / TOTAL_VERSES) * 100,
    100
  );

  const progressColor =
    progressPercent >= 70
      ? colors.success
      : colors.primary;

  /* =========================
     🔁 전체 초기화
     ========================= */
  const resetAll = () => {
    Alert.alert(
      "암송 기록 초기화",
      "지금까지 외운 모든 말씀이 초기화됩니다.\n다시 처음부터 시작할까요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "초기화",
          style: "destructive",
          onPress: () => {
            Array.from(memorized).forEach((id) =>
              toggle(id)
            );
          },
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        일용할 양식
      </Text>

      {/* 📊 암송 진행도 */}
      <Text style={[styles.section, { color: colors.text }]}>
        암송 진행도
      </Text>

      <View
        style={[
          styles.progressBox,
          { backgroundColor: colors.progressBg },
        ]}
      >
        <View
          style={[
            styles.progressBar,
            {
              width: `${progressPercent}%`,
              backgroundColor: progressColor,
            },
          ]}
        />
      </View>

      <Text style={[styles.sub, { color: colors.subText }]}>
        {count} / {TOTAL_VERSES} 구절
      </Text>

      {/* 🏠 최근 암송 */}
      <Text style={[styles.section, { color: colors.text }]}>
        최근 외운 말씀
      </Text>

      {recent ? (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card },
          ]}
        >
          <Text
            style={[
              styles.reference,
              { color: colors.text },
            ]}
          >
            {recent.reference}
          </Text>

          <Text
            style={[
              styles.text,
              { color: colors.subText },
            ]}
            numberOfLines={2}
          >
            {recent.text}
          </Text>
        </View>
      ) : (
        <Text style={[styles.empty, { color: colors.subText }]}>
          아직 외운 말씀이 없어요 🙏
        </Text>
      )}

      {/* 🔁 초기화 버튼 */}
      {count > 0 && (
        <Pressable
          style={[
            styles.resetButton,
            { backgroundColor: colors.card },
          ]}
          onPress={resetAll}
        >
          <Text
            style={{
              color: "#e57373",
              fontWeight: "600",
            }}
          >
            🔄 암송 다시 시작하기
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  section: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "600",
  },
  progressBox: {
    height: 12,
    borderRadius: 6,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
  sub: {
    marginTop: 6,
  },
  card: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
  },
  reference: {
    fontWeight: "600",
  },
  text: {
    marginTop: 6,
  },
  empty: {
    marginTop: 12,
  },
  resetButton: {
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
});
