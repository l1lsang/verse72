import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  FirebaseMemorizedVerse,
  getMemorizedFromFirebase,
} from "@/src/storage/memorize.firebase";
import { useTheme } from "@/src/theme/ThemeProvider";

const TOTAL_VERSES = 72;

export default function HomeScreen() {
  const { colors } = useTheme();

  const [recent, setRecent] =
    useState<FirebaseMemorizedVerse | null>(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔁 홈 탭 포커스될 때마다 Firebase에서 갱신
  const loadData = async () => {
    try {
      const list = await getMemorizedFromFirebase();
      setRecent(list[0] ?? null);
      setCount(list.length);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [])
  );

  const progressPercent = Math.min(
    (count / TOTAL_VERSES) * 100,
    100
  );

  // 📊 진행도 색상 규칙
  const progressColor =
    progressPercent >= 70
      ? colors.success
      : colors.primary;

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.subText }}>
          말씀 불러오는 중…
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Verse72
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
});
