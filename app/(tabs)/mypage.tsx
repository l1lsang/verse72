import { router, useFocusEffect } from "expo-router";
import { signOut } from "firebase/auth";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { auth } from "@/src/config/firebase";
import { verseGroups } from "@/src/data/verseGroups";
import { verses72 } from "@/src/data/verses72";
import {
  getMemorizeRecords,
  MemorizeRecord,
} from "@/src/storage/memorize";
import {
  FirebaseMemorizedVerse,
  getMemorizedFromFirebase,
} from "@/src/storage/memorize.firebase";
import { useTheme } from "@/src/theme/ThemeProvider";

const TOTAL = 72;

/* =========================
   📊 시험 히스토리 그래프
   ========================= */
function TestHistoryChart({ records }: { records: MemorizeRecord[] }) {
  const { colors } = useTheme();

  if (records.length === 0) {
    return (
      <Text style={{ color: colors.subText, marginTop: 12 }}>
        아직 암송 시험 기록이 없습니다.
      </Text>
    );
  }

  const maxHeight = 110;
  const recent = records.slice(-10);

  return (
    <View
      style={{
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
        backgroundColor: colors.card,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 12,
        }}
      >
        📊 암송 시험 히스토리
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          height: maxHeight,
        }}
      >
        {recent.map((r) => {
          const ratio = r.total === 0 ? 0 : r.score / r.total;
          const barHeight = Math.max(8, ratio * maxHeight);

          return (
            <View key={r.id} style={{ flex: 1, alignItems: "center" }}>
              <View
                style={{
                  width: 14,
                  height: barHeight,
                  borderRadius: 6,
                  backgroundColor: colors.primary,
                }}
              />
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 10,
                  color: colors.subText,
                }}
              >
                {Math.round(ratio * 100)}%
              </Text>
            </View>
          );
        })}
      </View>

      <Text
        style={{
          marginTop: 8,
          fontSize: 12,
          color: colors.subText,
        }}
      >
        최근 {recent.length}회 시험
      </Text>
    </View>
  );
}

export default function MyPageScreen() {
  const { colors, mode, setMode } = useTheme();
  const user = auth.currentUser;

  /* =========================
     🔑 카카오 프로필 URL https 강제
     ========================= */
  const photoURL = user?.photoURL
    ? user.photoURL.replace("http://", "https://")
    : null;

  const [memorized, setMemorized] = useState<FirebaseMemorizedVerse[]>([]);
  const [testRecords, setTestRecords] = useState<MemorizeRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await getMemorizedFromFirebase();
      setMemorized(list);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
      getMemorizeRecords().then(setTestRecords);
    }, [])
  );

  const totalCount = memorized.length;
  const totalPercent = Math.min((totalCount / TOTAL) * 100, 100);

  const getProgressColor = (percent: number) =>
    percent >= 70 ? colors.success : colors.primary;

  const groupStats = useMemo(() => {
    return verseGroups.map((group) => {
      const totalInGroup = verses72.filter(
        (v) => v.group === group.key
      ).length;

      const memorizedInGroup = memorized.filter((m) =>
        m.id.startsWith(group.key)
      ).length;

      const percent =
        totalInGroup === 0
          ? 0
          : (memorizedInGroup / totalInGroup) * 100;

      return {
        ...group,
        memorized: memorizedInGroup,
        total: totalInGroup,
        percent,
      };
    });
  }, [memorized]);

  const logout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          router.replace("/login");
        },
      },
    ]);
  };

  const isKakao = user?.providerData[0]?.providerId === "kakao.com";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadData} />
      }
    >
      <Text style={[styles.title, { color: colors.text }]}>
        마이페이지
      </Text>

      {/* 사용자 정보 */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          },
        ]}
      >
        {photoURL ? (
          <Image
            source={{ uri: photoURL }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.progressBg,
            }}
          />
        ) : null}

        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: colors.subText }]}>
            {isKakao ? "카카오 계정" : "이메일"}
          </Text>

          <Text style={[styles.value, { color: colors.text }]}>
            {user?.displayName || user?.email || "-"}
          </Text>
        </View>
      </View>

      {/* 전체 진행도 */}
      <Text style={[styles.section, { color: colors.text }]}>
        전체 암송 진행도
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
              width: `${totalPercent}%`,
              backgroundColor: getProgressColor(totalPercent),
            },
          ]}
        />
      </View>

      <Text style={[styles.sub, { color: colors.subText }]}>
        {totalCount} / {TOTAL} 구절
      </Text>

      {/* 그룹별 */}
      <Text style={[styles.section, { color: colors.text }]}>
        그룹별 암송 현황
      </Text>

      {groupStats.map((g) => (
        <View key={g.key} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.text, fontWeight: "600" }}>
            {g.key} · {g.title}
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
                  width: `${g.percent}%`,
                  backgroundColor: getProgressColor(g.percent),
                },
              ]}
            />
          </View>

          <Text style={[styles.sub, { color: colors.subText }]}>
            {g.memorized} / {g.total}
          </Text>
        </View>
      ))}

      {/* 시험 히스토리 */}
      <Text style={[styles.section, { color: colors.text }]}>
        암송 시험 기록
      </Text>

      <TestHistoryChart records={testRecords} />

      {/* 화면 모드 */}
      <Text style={[styles.section, { color: colors.text }]}>
        화면 모드
      </Text>

      <View style={styles.modeContainer}>
        {(["system", "light", "dark"] as const).map((m) => {
          const selected = mode === m;

          return (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              style={[
                styles.modeButton,
                {
                  backgroundColor: selected
                    ? colors.primary
                    : colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.modeText,
                  {
                    color: selected ? "#fff" : colors.text,
                  },
                ]}
              >
                {m === "system"
                  ? "🌗 시스템 설정 따르기"
                  : m === "light"
                  ? "☀️ 라이트 모드"
                  : "🌙 다크 모드"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 로그아웃 */}
      <Pressable
        style={[styles.logout, { backgroundColor: colors.card }]}
        onPress={logout}
      >
        <Text style={{ color: "#e57373", fontWeight: "600" }}>
          🔓 로그아웃
        </Text>
      </Pressable>
    </ScrollView>
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
  card: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  label: {
    fontSize: 14,
  },
  value: {
    marginTop: 4,
    fontSize: 16,
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
  modeContainer: {
    marginTop: 12,
    gap: 10,
  },
  modeButton: {
    padding: 14,
    borderRadius: 12,
  },
  modeText: {
    fontWeight: "600",
  },
  logout: {
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
});
