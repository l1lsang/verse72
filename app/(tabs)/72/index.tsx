import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/src/theme/ThemeProvider";

export default function VersesHome() {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* 헤더 */}
      <Text style={[styles.title, { color: colors.text }]}>
        말씀
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.subText },
        ]}
      >
        암송할 말씀을 선택하세요 🙏
      </Text>

      {/* 📖 72구절 */}
      <Pressable
        style={[
          styles.card,
          { backgroundColor: colors.card },
        ]}
        onPress={() => router.push("/verses/72")}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          📖 72구절 암송
        </Text>

        <Text
          style={[
            styles.cardDesc,
            { color: colors.subText },
          ]}
        >
          성경 핵심 구절 72개를
          단계별로 암송해보세요
        </Text>
      </Pressable>

      {/* 📘 로마서 8장 */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            opacity: 0.5,
          },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          📘 로마서 8장
        </Text>

        <Text
          style={[
            styles.cardDesc,
            { color: colors.subText },
          ]}
        >
          준비 중인 묵상 콘텐츠입니다
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
  },
  card: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cardDesc: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});
